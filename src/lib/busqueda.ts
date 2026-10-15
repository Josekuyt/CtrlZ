import { create, insertMultiple, search } from '@orama/orama';
import { stemmer, language } from '@orama/stemmers/spanish';

/** Documento del índice (/public/search/concepts.json). Cubre glosario y temario. */
export interface DocBusqueda {
  id: string;
  tipo: 'Glosario' | 'Temario';
  titulo: string;
  resumen: string; // definición (glosario) o capítulo (temario)
  texto: string;
  consultas: string[];
  sinonimos: string[];
  contexto: string; // categoría o capítulo
  url: string;
}

export interface Resultado extends DocBusqueda {
  score: number;
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
  const q = termino.trim();
  const { db, docs } = await indice();
  if (!q) return [];

  const porId = new Map(docs.map((d) => [d.id, d]));
  const res = await search(db, {
    term: q,
    properties: ['titulo', 'consultas', 'sinonimos', 'resumen', 'texto'],
    boost: { titulo: 3, consultas: 2, sinonimos: 2 },
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
