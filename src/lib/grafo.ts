import type { Concepto, TipoRelacion } from './schema';

/** Relación inversa de cada tipo (las simétricas se mapean a sí mismas). */
const INVERSA: Record<TipoRelacion, TipoRelacion> = {
  es_un: 'tiene_tipo',
  tiene_tipo: 'es_un',
  parte_de: 'tiene_parte',
  tiene_parte: 'parte_de',
  relacionado_con: 'relacionado_con',
  se_confunde_con: 'se_confunde_con',
  sinonimo_de: 'sinonimo_de',
  ver_tambien: 'ver_tambien',
};

/**
 * Añade las relaciones inversas al grafo.
 * Declaras una dirección en la ficha y aquí se completa la otra,
 * de modo que ambos conceptos quedan conectados sin trabajo doble.
 * Muta el Map que recibe y lo devuelve.
 */
export function derivarInversas(
  conceptos: Map<string, Concepto>,
): Map<string, Concepto> {
  for (const c of conceptos.values()) {
    for (const r of c.relaciones) {
      const destino = conceptos.get(r.destino);
      if (!destino) {
        throw new Error(
          `Relación a concepto inexistente: "${r.destino}" (desde "${c.id}")`,
        );
      }
      const tipoInverso = INVERSA[r.tipo];
      const yaExiste = destino.relaciones.some(
        (x) => x.tipo === tipoInverso && x.destino === c.id,
      );
      if (!yaExiste) {
        destino.relaciones.push({ tipo: tipoInverso, destino: c.id });
      }
    }
  }
  return conceptos;
}

/** Etiquetas legibles para mostrar cada tipo de relación en la ficha. */
export const ETIQUETA_RELACION: Record<TipoRelacion, string> = {
  es_un: 'Es un',
  tiene_tipo: 'Tipos',
  parte_de: 'Parte de',
  tiene_parte: 'Partes',
  relacionado_con: 'Relacionado',
  se_confunde_con: 'Se confunde con',
  sinonimo_de: 'Sinónimo de',
  ver_tambien: 'Ver también',
};
