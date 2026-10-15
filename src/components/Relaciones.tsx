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
    <section className="mt-10">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-black/40">
        Relaciones
      </h2>
      <dl className="mt-3 flex flex-col gap-3">
        {ORDEN.filter((t) => porTipo.has(t)).map((t) => (
          <div key={t} className="flex flex-col sm:flex-row sm:gap-4">
            <dt className="w-40 shrink-0 text-sm text-black/50">
              {ETIQUETA_RELACION[t]}
            </dt>
            <dd className="flex flex-wrap gap-2">
              {porTipo.get(t)!.map((d) => (
                <Link
                  key={d.id}
                  href={`/glosario/${d.disciplina}/${d.id}/`}
                  className="rounded-full border border-black/15 px-3 py-0.5 text-sm hover:border-acento hover:text-acento"
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
