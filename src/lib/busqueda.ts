import { create, insertMultiple, search } from '@orama/orama';
import { stemmer, language } from '@orama/stemmers/spanish';

/** Documento tal y como se publica en /public/search/concepts.json */
export interface DocBusqueda {
  id: string;
  nombre: string;
  definicion: string;
  categoria: string;
  disciplina: string;
  sinonimos: string[];
  consultas: string[];
  etiquetas: string[];
}

export interface Resultado extends DocBusqueda {
  score: number;
}

const esquema = {
  nombre: 'string',
  definicion: 'string',
  categoria: 'string',
  disciplina: 'string',
  sinonimos: 'string[]',
  consultas: 'string[]',
  etiquetas: 'string[]',
} as const;

let dbPromise: ReturnType<typeof construir> | null = null;

async function construir() {
  const res = await fetch('/search/concepts.json');
  const docs: DocBusqueda[] = await res.json();

  const db = await create({
    schema: esquema,
    components: { tokenizer: { language, stemming: true, stemmer } },
  });
  // Guardamos el id en el propio documento para recuperarlo en los resultados.
  await insertMultiple(db, docs as unknown as Record<string, unknown>[]);
  return { db, docs };
}

/** Construye el índice una sola vez (en el navegador) y lo reutiliza. */
export function indice() {
  if (!dbPromise) dbPromise = construir();
  return dbPromise;
}

export async function buscar(termino: string, limite = 20): Promise<Resultado[]> {
  const q = termino.trim();
  const { db, docs } = await indice();
  if (!q) return [];

  const porId = new Map(docs.map((d) => [d.id, d]));
  const res = await search(db, {
    term: q,
    properties: ['nombre', 'sinonimos', 'consultas', 'definicion', 'etiquetas'],
    boost: { nombre: 3, sinonimos: 2, consultas: 2 },
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
