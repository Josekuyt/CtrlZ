/**
 * Genera /public/search/concepts.json a partir de las fichas.
 * Se ejecuta automáticamente antes de `dev` y `build` (ver package.json).
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { cargarConceptos } from '../src/lib/conceptos';
import { derivarInversas } from '../src/lib/grafo';
import type { DocBusqueda } from '../src/lib/busqueda';

function main() {
  const conceptos = derivarInversas(cargarConceptos());

  const docs: DocBusqueda[] = [...conceptos.values()].map((c) => ({
    id: c.id,
    nombre: c.nombre,
    definicion: c.definicion,
    categoria: c.categoria,
    disciplina: c.disciplina,
    sinonimos: c.sinonimos,
    consultas: c.consultas,
    etiquetas: c.etiquetas,
  }));

  const dir = join(process.cwd(), 'public', 'search');
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'concepts.json'), JSON.stringify(docs), 'utf8');

  console.log(`[build-index] ${docs.length} conceptos indexados -> public/search/concepts.json`);
}

main();
