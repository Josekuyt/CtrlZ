import Link from 'next/link';
import type { Concepto, TipoRelacion } from '@/lib/schema';
import { ETIQUETA_RELACION } from '@/lib/grafo';

const ORDEN: TipoRelacion[] = [
  'es_un',
  'tiene_tipo',
  'parte_de',
  'tiene_parte',
  'se_confunde_con',
  'relacionado_con',
  'sinonimo_de',
  'ver_tambien',
];

/** Relaciones del concepto, en formato compacto para la barra lateral. */
export default function Relaciones({
  concepto,
  grafo,
}: {
  concepto: Concepto;
  grafo: Map<string, Concepto>;
}) {
  if (concepto.relaciones.length === 0) return null;

  const porTipo = new Map<TipoRelacion, Concepto[]>();
  for (const r of concepto.relaciones) {
    const destino = grafo.get(r.destino);
    if (!destino) continue;
    const lista = porTipo.get(r.tipo) ?? [];
    lista.push(destino);
    porTipo.set(r.tipo, lista);
  }

  return (
    <section>
      <p className="eyebrow mb-3">Relacionados</p>
      <dl className="flex flex-col gap-3">
        {ORDEN.filter((t) => porTipo.has(t)).map((t) => (
          <div key={t}>
            <dt className="mb-1.5 text-xs text-neutro-500">{ETIQUETA_RELACION[t]}</dt>
            <dd className="flex flex-wrap gap-1.5">
              {porTipo.get(t)!.map((d) => (
                <Link
                  key={d.id}
                  href={`/glosario/${d.disciplina}/${d.id}/`}
                  className="rounded-full border border-neutro-300 px-3 py-0.5 text-sm text-neutro-700 transition hover:border-rojo-500 hover:text-rojo-600"
                >
                  {d.nombre}
                </Link>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
