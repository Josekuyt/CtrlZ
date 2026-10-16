/**
 * Etiquetas legibles (con acento y mayúscula) para categorías y niveles
 * del glosario. Centralizado para que ficha, índice y glosario por
 * disciplina muestren siempre lo mismo, nunca el slug crudo.
 */

const ETIQUETA_CATEGORIA: Record<string, string> = {
  reticula: 'Retícula',
  tipografia: 'Tipografía',
  maquetacion: 'Maquetación',
  composicion: 'Composición',
  'publicaciones-periodicas': 'Publicaciones periódicas',
};

export function etiquetaCategoria(cat: string): string {
  return (
    ETIQUETA_CATEGORIA[cat] ??
    cat.replace(/-/g, ' ').replace(/^./, (m) => m.toUpperCase())
  );
}

const ETIQUETA_NIVEL: Record<string, string> = {
  basico: 'Básico',
  intermedio: 'Intermedio',
  avanzado: 'Avanzado',
};

export const ORDEN_NIVEL = ['basico', 'intermedio', 'avanzado'];

export function etiquetaNivel(nivel: string): string {
  return ETIQUETA_NIVEL[nivel] ?? nivel;
}
