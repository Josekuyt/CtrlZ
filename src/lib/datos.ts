import { cache } from 'react';
import { cargarConceptos, listarDisciplinas } from './conceptos';
import { derivarInversas } from './grafo';
import type { Concepto } from './schema';

/**
 * Carga única del grafo de conceptos (fichas + relaciones inversas).
 * `cache` evita recargar en cada página durante el build.
 * Solo para componentes de servidor (lee del sistema de ficheros).
 */
export const obtenerGrafo = cache((): Map<string, Concepto> => {
  return derivarInversas(cargarConceptos());
});

export function obtenerConcepto(slug: string): Concepto | undefined {
  return obtenerGrafo().get(slug);
}

export function obtenerTodos(): Concepto[] {
  return [...obtenerGrafo().values()].sort((a, b) =>
    a.nombre.localeCompare(b.nombre, 'es'),
  );
}

export function obtenerDisciplinas(): string[] {
  return listarDisciplinas(obtenerGrafo());
}

export type TerminoApartado = {
  id: string;
  nombre: string;
  definicion: string;
  disciplina: string;
};

/**
 * Invierte el backlink `temario:` de cada ficha para saber qué términos
 * del glosario corresponden a cada apartado del temario.
 * Devuelve un Map con clave "<disciplina>/<capitulo>/<apartado>".
 */
export const terminosPorApartado = cache((): Map<string, TerminoApartado[]> => {
  const mapa = new Map<string, TerminoApartado[]>();
  const re = /^\/temario\/([^/]+)\/([^/]+)\/#(.+)$/;

  for (const c of obtenerTodos()) {
    if (!c.temario) continue;
    const m = re.exec(c.temario.trim());
    if (!m) continue;
    const clave = `${m[1]}/${m[2]}/${m[3]}`;
    const lista = mapa.get(clave) ?? [];
    lista.push({
      id: c.id,
      nombre: c.nombre,
      definicion: c.definicion,
      disciplina: c.disciplina,
    });
    mapa.set(clave, lista);
  }

  // Orden alfabético estable dentro de cada apartado.
  for (const lista of mapa.values()) {
    lista.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  }
  return mapa;
});
