import { z } from 'zod';

/**
 * Tipos de relación entre conceptos.
 * Se declara una dirección y el grafo deriva la inversa en el build
 * (p. ej. declaras `parte_de` y se genera `tiene_parte` en el destino).
 */
export const TipoRelacion = z.enum([
  'es_un',
  'tiene_tipo',
  'parte_de',
  'tiene_parte',
  'relacionado_con',
  'se_confunde_con',
  'sinonimo_de',
  'ver_tambien',
]);
export type TipoRelacion = z.infer<typeof TipoRelacion>;

export const Relacion = z.object({
  tipo: TipoRelacion,
  destino: z.string(), // slug del concepto relacionado
});
export type Relacion = z.infer<typeof Relacion>;

export const Referencia = z.object({
  titulo: z.string(),
  autor: z.string().optional(),
  anio: z.number().optional(),
  url: z.string().url().optional(),
});
export type Referencia = z.infer<typeof Referencia>;

export const Nivel = z.enum(['basico', 'intermedio', 'avanzado']);

/** Campos del frontmatter de una ficha (el cuerpo MDX es la explicación ampliada). */
export const ConceptoFrontmatter = z.object({
  id: z.string(),
  nombre: z.string(),
  definicion: z.string(),
  categoria: z.string(),
  disciplina: z.string().default('editorial'),
  nivel: Nivel.default('basico'),
  sinonimos: z.array(z.string()).default([]),
  consultas: z.array(z.string()).default([]), // frases informales de búsqueda
  etiquetas: z.array(z.string()).default([]),
  relaciones: z.array(Relacion).default([]),
  ejemplos: z.array(z.string()).default([]),
  referencias: z.array(Referencia).default([]),
  // Enlace opcional al apartado del temario que lo explica a fondo.
  temario: z.string().optional(),
});

/** Concepto completo: frontmatter + explicación (cuerpo MDX en texto). */
export const Concepto = ConceptoFrontmatter.extend({
  explicacion: z.string().default(''),
});
export type Concepto = z.infer<typeof Concepto>;

/**
 * Fuente de información (se usará con el panel/ingesta — Supabase).
 * Guardamos TEXTO + metadatos + enlace, nunca los binarios pesados.
 */
export const TipoFuente = z.enum(['web', 'snapshot', 'pdf', 'texto']);
export const Fuente = z.object({
  id: z.string(),
  tipo: TipoFuente,
  titulo: z.string(),
  url: z.string().url().optional(),
  texto: z.string(),
  conceptos: z.array(z.string()).default([]),
  etiquetas: z.array(z.string()).default([]),
  fecha: z.string().optional(),
  estado: z.enum(['pendiente', 'procesada', 'revisada']).default('pendiente'),
});
export type Fuente = z.infer<typeof Fuente>;
