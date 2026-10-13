// CtrlZ · Ingesta de fuentes.
// Busca en Supabase las fuentes en estado "pendiente" que tengan URL
// (web / snapshot / pdf), extrae su texto y lo guarda, marcándolas como
// "procesada". Se ejecuta en GitHub Actions con la service_role key
// (bypassa la RLS, por eso va como secreto y nunca en el cliente).

import { createClient } from '@supabase/supabase-js';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import { extractText, getDocumentProxy } from 'unpdf';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY (secretos del repo).');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

const MAX_CHARS = 100_000;
const UA = 'CtrlZ-ingesta/1.0 (+https://github.com)';

function limpiar(texto) {
  return String(texto)
    .replace(/\r/g, '')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, MAX_CHARS);
}

async function textoDesdeWeb(url) {
  const res = await fetch(url, { headers: { 'user-agent': UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  const dom = new JSDOM(html, { url });
  const articulo = new Readability(dom.window.document).parse();
  const texto = articulo?.textContent || dom.window.document.body?.textContent || '';
  return limpiar(texto);
}

async function textoDesdePdf(url) {
  const res = await fetch(url, { headers: { 'user-agent': UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = new Uint8Array(await res.arrayBuffer());
  const pdf = await getDocumentProxy(buf);
  const { text } = await extractText(pdf, { mergePages: true });
  return limpiar(text);
}

async function main() {
  const { data: fuentes, error } = await supabase
    .from('fuentes')
    .select('id, tipo, url, titulo')
    .eq('estado', 'pendiente')
    .not('url', 'is', null);

  if (error) {
    console.error('Error consultando fuentes:', error.message);
    process.exit(1);
  }
  if (!fuentes || fuentes.length === 0) {
    console.log('No hay fuentes pendientes con URL. Nada que hacer.');
    return;
  }

  console.log(`Procesando ${fuentes.length} fuente(s)…`);
  let ok = 0;
  for (const f of fuentes) {
    try {
      const esPdf = f.tipo === 'pdf' || /\.pdf($|\?)/i.test(f.url);
      const texto = esPdf ? await textoDesdePdf(f.url) : await textoDesdeWeb(f.url);
      if (!texto) throw new Error('no se extrajo texto');
      const { error: upErr } = await supabase
        .from('fuentes')
        .update({ texto, estado: 'procesada' })
        .eq('id', f.id);
      if (upErr) throw upErr;
      console.log(`  OK  ${f.titulo} — ${texto.length} caracteres`);
      ok++;
    } catch (e) {
      console.error(`  --  ${f.titulo}: ${e.message}`);
    }
  }
  console.log(`Hecho: ${ok}/${fuentes.length} fuentes procesadas.`);
}

main();
