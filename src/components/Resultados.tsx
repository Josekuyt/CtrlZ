'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { buscar, type Resultado } from '@/lib/busqueda';
import { etiquetaCategoria } from '@/lib/etiquetas';
import CajaBusqueda from '@/components/CajaBusqueda';
import Resaltar from '@/components/Resaltar';

type FiltroTipo = 'todo' | 'Temario' | 'Glosario';

const DISC_LABEL: Record<string, string> = {
  editorial: 'Diseño editorial',
  tipografia: 'Tipografía',
};

function disciplinaDe(url: string): string {
  return url.split('/')[2] ?? 'editorial';
}
function etiquetaDisciplina(slug: string): string {
  return DISC_LABEL[slug] ?? slug.replace(/^./, (m) => m.toUpperCase());
}

/** Una opción de filtro: etiqueta + recuento, con estado activo. */
function OpcionFiltro({
  label,
  n,
  activo,
  onClick,
}: {
  label: string;
  n: number;
  activo: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition ${
        activo
          ? 'bg-rojo-50 font-medium text-rojo-600'
          : 'text-neutro-700 hover:bg-neutro-50'
      }`}
    >
      <span className="truncate">{label}</span>
      <span className={`shrink-0 text-xs ${activo ? 'text-rojo-500' : 'text-neutro-400'}`}>
        {n}
      </span>
    </button>
  );
}

export default function Resultados() {
  const params = useSearchParams();
  const q = params.get('q') ?? '';
  const [hits, setHits] = useState<Resultado[]>([]);
  const [cargando, setCargando] = useState(false);
  const [tipo, setTipo] = useState<FiltroTipo>('todo');
  const [disc, setDisc] = useState<string>('todo');

  useEffect(() => {
    let activo = true;
    if (!q) {
      setHits([]);
      return;
    }
    setCargando(true);
    setTipo('todo');
    setDisc('todo');
    buscar(q)
      .then((r) => activo && setHits(r))
      .finally(() => activo && setCargando(false));
    return () => {
      activo = false;
    };
  }, [q]);

  // Disciplinas presentes en los resultados (para el grupo DISCIPLINA).
  const disciplinas = useMemo(() => {
    const s = new Set(hits.map((h) => disciplinaDe(h.url)));
    return [...s].sort();
  }, [hits]);

  // Recuentos faceteados (cada grupo cuenta sobre el filtro del otro grupo).
  const trasDisc = disc === 'todo' ? hits : hits.filter((h) => disciplinaDe(h.url) === disc);
  const trasTipo = tipo === 'todo' ? hits : hits.filter((h) => h.tipo === tipo);

  const nTipo = {
    todo: trasDisc.length,
    Temario: trasDisc.filter((h) => h.tipo === 'Temario').length,
    Glosario: trasDisc.filter((h) => h.tipo === 'Glosario').length,
  };
  const nDiscTodo = trasTipo.length;

  const visibles = hits.filter(
    (h) =>
      (tipo === 'todo' || h.tipo === tipo) &&
      (disc === 'todo' || disciplinaDe(h.url) === disc),
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Buscador prominente, prellenado con la consulta actual */}
      <div className="mx-auto w-full max-w-2xl">
        <CajaBusqueda valorInicial={q} globalHotkey />
      </div>

      {!q && (
        <p className="text-neutro-500">
          Escribe una duda arriba para empezar a buscar.
        </p>
      )}

      {q && (
        <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-10">
          {/* Panel de filtros */}
          <aside className="mb-8 lg:mb-0">
            {!cargando && hits.length > 0 && (
              <div className="flex flex-col gap-6 lg:sticky lg:top-24">
                <div>
                  <p className="eyebrow mb-2 px-3">Tipo</p>
                  <OpcionFiltro label="Todo" n={nTipo.todo} activo={tipo === 'todo'} onClick={() => setTipo('todo')} />
                  <OpcionFiltro label="Temario" n={nTipo.Temario} activo={tipo === 'Temario'} onClick={() => setTipo('Temario')} />
                  <OpcionFiltro label="Glosario" n={nTipo.Glosario} activo={tipo === 'Glosario'} onClick={() => setTipo('Glosario')} />
                </div>
                <div>
                  <p className="eyebrow mb-2 px-3">Disciplina</p>
                  <OpcionFiltro label="Todo" n={nDiscTodo} activo={disc === 'todo'} onClick={() => setDisc('todo')} />
                  {disciplinas.map((d) => (
                    <OpcionFiltro
                      key={d}
                      label={etiquetaDisciplina(d)}
                      n={trasTipo.filter((h) => disciplinaDe(h.url) === d).length}
                      activo={disc === d}
                      onClick={() => setDisc(d)}
                    />
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* Resultados */}
          <div className="min-w-0">
            <p className="mb-6 text-sm text-neutro-500">
              {cargando
                ? 'Buscando…'
                : hits.length > 0
                  ? `Esto es lo que hemos encontrado · ${visibles.length} resultado${visibles.length === 1 ? '' : 's'}`
                  : null}
            </p>

            <div className="flex flex-col gap-4">
              {visibles.map((h) => (
                <Link
                  key={h.id}
                  href={h.url}
                  className="group rounded-xl border border-neutro-200 bg-white p-5 transition hover:border-neutro-300 hover:shadow-sm sm:p-6"
                >
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="rounded bg-neutro-100 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-neutro-500">
                      {h.tipo}
                    </span>
                    <span className="rounded bg-neutro-100 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-neutro-500">
                      {etiquetaCategoria(h.contexto)}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-neutro-950 group-hover:text-rojo-600">
                    <Resaltar texto={h.titulo} consulta={q} />
                  </h2>
                  <p className="mt-1.5 text-neutro-600">
                    <Resaltar texto={h.resumen} consulta={q} />
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-rojo-600">
                    Ver explicación <span aria-hidden="true">→</span>
                  </span>
                </Link>
              ))}
            </div>

            {!cargando && hits.length === 0 && (
              <div className="text-neutro-600">
                <p>No hemos encontrado una coincidencia clara. Prueba a describirlo de otra forma.</p>
                <p className="mt-2 text-sm">
                  También puedes{' '}
                  <Link href="/temario" className="text-rojo-600 underline underline-offset-2">
                    explorar el temario
                  </Link>{' '}
                  o{' '}
                  <Link href="/glosario" className="text-rojo-600 underline underline-offset-2">
                    ver el glosario
                  </Link>
                  .
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
