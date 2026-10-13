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
