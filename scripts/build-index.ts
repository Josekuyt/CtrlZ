/**
 * Genera /public/search/concepts.json a partir del glosario (conceptos)
 * y del temario (apartados). Se ejecuta antes de `dev` y `build`.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { cargarConceptos } from '../src/lib/conceptos';
import { derivarInversas } from '../src/lib/grafo';
import { cargarTemario } from '../src/lib/temario';
import type { DocBusqueda } from '../src/lib/busqueda';

function main() {
  const docs: DocBusqueda[] = [];

  // Glosario (conceptos)
  const conceptos = derivarInversas(cargarConceptos());
  for (const c of conceptos.values()) {
    docs.push({
      id: `glosario:${c.id}`,
      tipo: 'Glosario',
      titulo: c.nombre,
      resumen: c.definicion,
      texto: c.definicion,
      consultas: c.consultas,
      sinonimos: c.sinonimos,
      contexto: c.categoria,
      url: `/${c.disciplina}/${c.id}/`,
    });
  }

  // Temario (apartados), agrupado por disciplina
  for (const disc of cargarTemario()) {
    for (const cap of disc.capitulos) {
      for (const ap of cap.apartados) {
        docs.push({
          id: `temario:${disc.slug}/${cap.slug}/${ap.slug}`,
          tipo: 'Temario',
          titulo: ap.titulo,
          resumen: `${disc.titulo} · ${cap.titulo}`,
          texto: ap.texto,
          consultas: ap.consultas,
          sinonimos: [],
          contexto: cap.titulo,
          url: `/temario/${disc.slug}/${cap.slug}/${ap.slug}/`,
        });
      }
    }
  }

  const dir = join(process.cwd(), 'public', 'search');
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'concepts.json'), JSON.stringify(docs), 'utf8');

  console.log(`[build-index] ${docs.length} documentos indexados (glosario + temario)`);
}

main();
