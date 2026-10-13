'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { buscar, type Resultado } from '@/lib/busqueda';
import CajaBusqueda from '@/components/CajaBusqueda';

export default function Resultados() {
  const params = useSearchParams();
  const q = params.get('q') ?? '';
  const [hits, setHits] = useState<Resultado[]>([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    let activo = true;
    if (!q) {
      setHits([]);
      return;
    }
    setCargando(true);
    buscar(q)
      .then((r) => {
        if (activo) setHits(r);
      })
      .finally(() => {
        if (activo) setCargando(false);
      });
    return () => {
      activo = false;
    };
  }, [q]);

  return (
    <div className="flex flex-col gap-6">
      <CajaBusqueda valorInicial={q} />

      {q && (
        <p className="text-sm text-black/50">
          {cargando
            ? 'Buscando…'
            : `${hits.length} resultado${hits.length === 1 ? '' : 's'} para "${q}"`}
        </p>
      )}

      <ul className="flex flex-col divide-y divide-black/10">
        {hits.map((h) => (
          <li key={h.id} className="py-4">
            <Link
              href={`/${h.disciplina}/${h.id}/`}
              className="group block"
            >
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-lg font-medium group-hover:text-acento">
                  {h.nombre}
                </span>
                <span className="shrink-0 text-xs uppercase tracking-wide text-black/40">
                  {h.categoria}
                </span>
              </div>
              <p className="mt-1 text-black/60">{h.definicion}</p>
            </Link>
          </li>
        ))}
      </ul>

      {q && !cargando && hits.length === 0 && (
        <p className="text-black/60">
          No hemos encontrado nada para <strong>{q}</strong>. Prueba con otras
          palabras o describe la idea de otra forma.
        </p>
      )}
    </div>
  );
}
