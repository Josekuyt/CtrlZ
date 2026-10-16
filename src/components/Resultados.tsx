'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { buscar, type Resultado } from '@/lib/busqueda';
import CajaBusqueda from '@/components/CajaBusqueda';
import Resaltar from '@/components/Resaltar';

type Filtro = 'todo' | 'Temario' | 'Glosario';

export default function Resultados() {
  const params = useSearchParams();
  const q = params.get('q') ?? '';
  const [hits, setHits] = useState<Resultado[]>([]);
  const [cargando, setCargando] = useState(false);
  const [filtro, setFiltro] = useState<Filtro>('todo');

  useEffect(() => {
    let activo = true;
    if (!q) {
      setHits([]);
      return;
    }
    setCargando(true);
    buscar(q)
      .then((r) => activo && setHits(r))
      .finally(() => activo && setCargando(false));
    return () => {
      activo = false;
    };
  }, [q]);

  const conteo = useMemo(
    () => ({
      todo: hits.length,
      Temario: hits.filter((h) => h.tipo === 'Temario').length,
      Glosario: hits.filter((h) => h.tipo === 'Glosario').length,
    }),
    [hits],
  );

  const visibles = filtro === 'todo' ? hits : hits.filter((h) => h.tipo === filtro);

  const chips: Filtro[] = ['todo', 'Temario', 'Glosario'];

  return (
    <div className="flex flex-col gap-6">
      <CajaBusqueda valorInicial={q} globalHotkey />

      {q && (
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm text-black/50">
            {cargando
              ? 'Buscando…'
              : `${conteo.todo} resultado${conteo.todo === 1 ? '' : 's'} para "${q}"`}
          </p>
          {!cargando && hits.length > 0 && (
            <div className="flex gap-2">
              {chips.map((c) => (
                <button
                  key={c}
                  onClick={() => setFiltro(c)}
                  className={`rounded-full border px-3 py-0.5 text-xs ${
                    filtro === c
                      ? 'border-acento text-acento'
                      : 'border-black/15 text-black/50 hover:border-acento'
                  }`}
                >
                  {c === 'todo' ? 'Todo' : c} ({conteo[c]})
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <ul className="flex flex-col divide-y divide-black/10">
        {visibles.map((h) => (
          <li key={h.id} className="py-4">
            <Link href={h.url} className="group block">
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-lg font-medium group-hover:text-acento">
                  <Resaltar texto={h.titulo} consulta={q} />
                </span>
                <span className="shrink-0 text-xs uppercase tracking-wide text-black/40">
                  {h.tipo} · {h.contexto}
                </span>
              </div>
              <p className="mt-1 text-black/60">
                <Resaltar texto={h.resumen} consulta={q} />
              </p>
            </Link>
          </li>
        ))}
      </ul>

      {q && !cargando && hits.length === 0 && (
        <div className="text-black/60">
          <p>
            No hemos encontrado nada para <strong>{q}</strong>. Prueba con otras
            palabras o describe la idea de otra forma.
          </p>
          <p className="mt-2 text-sm">
            También puedes{' '}
            <Link href="/temario" className="text-acento underline underline-offset-2">
              explorar el temario
            </Link>{' '}
            o{' '}
            <Link href="/glosario" className="text-acento underline underline-offset-2">
              ver el glosario
            </Link>
            .
          </p>
        </div>
      )}
    </div>
  );
}
