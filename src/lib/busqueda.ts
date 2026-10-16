import { create, insertMultiple, search } from '@orama/orama';
import { stemmer, language } from '@orama/stemmers/spanish';

/** Documento del índice (/public/search/concepts.json). Cubre glosario y temario. */
export interface DocBusqueda {
  id: string;
  tipo: 'Glosario' | 'Temario';
  titulo: string;
  resumen: string;
  texto: string;
  consultas: string[];
  sinonimos: string[];
  contexto: string;
  url: string;
}

export interface Resultado extends DocBusqueda {
  score: number;
}

// Palabras vacías y de pregunta: se quitan de la consulta para reducir ruido.
const VACIAS = new Set([
  'que', 'qué', 'como', 'cómo', 'cual', 'cuál', 'cuáles', 'se', 'para', 'por',
  'de', 'del', 'la', 'el', 'los', 'las', 'un', 'una', 'unos', 'unas', 'y', 'o',
  'u', 'en', 'hay', 'es', 'son', 'al', 'lo', 'me', 'mi', 'tu', 'su', 'le',
  'donde', 'dónde',
]);

function tokeniza(q: string): string[] {
  return q
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.replace(/[¿?¡!.,;:()"']/g, ''))
    .filter(Boolean);
}

/** Limpia la consulta quitando palabras vacías (sin romperla si solo había esas). */
export function limpiarConsulta(q: string): string {
  const t = tokeniza(q).filter((w) => !VACIAS.has(w));
  return t.length ? t.join(' ') : q.trim();
}

/** Tokens significativos de la consulta (para resaltar en los resultados). */
export function tokensConsulta(q: string): string[] {
  return tokeniza(q).filter((w) => !VACIAS.has(w) && w.length >= 3);
}

const esquema = {
  titulo: 'string',
  resumen: 'string',
  texto: 'string',
  consultas: 'string[]',
  sinonimos: 'string[]',
  tipo: 'string',
  contexto: 'string',
} as const;

let dbPromise: ReturnType<typeof construir> | null = null;

async function construir() {
  const res = await fetch('/search/concepts.json');
  const docs: DocBusqueda[] = await res.json();
  const db = await create({
    schema: esquema,
    components: { tokenizer: { language, stemming: true, stemmer } },
  });
  await insertMultiple(db, docs as unknown as Record<string, unknown>[]);
  return { db, docs };
}

export function indice() {
  if (!dbPromise) dbPromise = construir();
  return dbPromise;
}

export async function buscar(termino: string, limite = 20): Promise<Resultado[]> {
  const q = limpiarConsulta(termino);
  const { db, docs } = await indice();
  if (!q) return [];

  const porId = new Map(docs.map((d) => [d.id, d]));
  const res = await search(db, {
    term: q,
    properties: ['titulo', 'consultas', 'sinonimos', 'resumen', 'texto'],
    boost: { titulo: 3, consultas: 4, sinonimos: 2, resumen: 1, texto: 1 },
    tolerance: 1,
    limit: limite,
  });

  return res.hits
    .map((h) => {
      const doc = porId.get(String((h.document as DocBusqueda).id));
      return doc ? { ...doc, score: h.score } : null;
    })
    .filter((x): x is Resultado => x !== null);
}
