import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { Concepto, ConceptoFrontmatter } from './schema';

const CONTENT_DIR = join(process.cwd(), 'content', 'glosario');

/**
 * Carga todas las fichas desde /content/<disciplina>/*.mdx,
 * valida cada una con Zod y devuelve un Map por id (slug).
 * Se ejecuta en build (SSG) y en el script de indexado — nunca en el cliente.
 */
export function cargarConceptos(): Map<string, Concepto> {
  const conceptos = new Map<string, Concepto>();
  if (!existsSync(CONTENT_DIR)) return conceptos;

  for (const disciplina of readdirSync(CONTENT_DIR)) {
    const dir = join(CONTENT_DIR, disciplina);
    let files: string[] = [];
    try {
      files = readdirSync(dir).filter((f) => f.endsWith('.mdx'));
    } catch {
      continue; // no es un directorio de disciplina
    }

    for (const file of files) {
      const raw = readFileSync(join(dir, file), 'utf8');
      const { data, content } = matter(raw);
      const fm = ConceptoFrontmatter.parse({ ...data, disciplina });
      const ficha = Concepto.parse({ ...fm, explicacion: content.trim() });
      if (conceptos.has(ficha.id)) {
        throw new Error(`Concepto duplicado: "${ficha.id}" (${file})`);
      }
      conceptos.set(ficha.id, ficha);
    }
  }

  return conceptos;
}

/** Lista de disciplinas presentes en el contenido. */
export function listarDisciplinas(conceptos: Map<string, Concepto>): string[] {
  return [...new Set([...conceptos.values()].map((c) => c.disciplina))].sort();
}
