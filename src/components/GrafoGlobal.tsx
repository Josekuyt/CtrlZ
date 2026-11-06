'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

export type CapNodo = { key: string; titulo: string; url: string };
export type Puente = {
  id: string;
  nombre: string;
  url: string;
  izqKey: string;
  derKey: string;
};
export type DiscLado = { slug: string; nombre: string; capitulos: CapNodo[] };

type Props = { izquierda: DiscLado; derecha: DiscLado; puentes: Puente[] };

const W = 920;
const ROW = 60;
const PADY = 48;
const X_IZQ = 300;
const X_DER = 620;

function truncar(s: string, n = 28): string {
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}

type Activo = { tipo: 'cap' | 'concepto'; key: string } | null;

export default function GrafoGlobal({ izquierda, derecha, puentes }: Props) {
  const [activo, setActivo] = useState<Activo>(null);

  const H = Math.max(izquierda.capitulos.length, derecha.capitulos.length) * ROW + PADY * 2;

  const yDe = (caps: CapNodo[], i: number) => {
    const start = (H - caps.length * ROW) / 2;
    return start + i * ROW + ROW / 2;
  };
  const yIzq = new Map(izquierda.capitulos.map((c, i) => [c.key, yDe(izquierda.capitulos, i)]));
  const yDer = new Map(derecha.capitulos.map((c, i) => [c.key, yDe(derecha.capitulos, i)]));

  // Enlaces capítulo↔capítulo, agrupando los conceptos que los conectan.
  const enlaces = useMemo(() => {
    const m = new Map<string, { izqKey: string; derKey: string; conceptos: Puente[] }>();
    for (const p of puentes) {
      const k = p.izqKey + '|' + p.derKey;
      const e = m.get(k) ?? { izqKey: p.izqKey, derKey: p.derKey, conceptos: [] };
      e.conceptos.push(p);
      m.set(k, e);
    }
    return [...m.values()];
  }, [puentes]);

  const conceptoDe = (id: string) => puentes.find((p) => p.id === id);

  function enlaceActivo(e: { izqKey: string; derKey: string }): boolean {
    if (!activo) return false;
    if (activo.tipo === 'cap') return e.izqKey === activo.key || e.derKey === activo.key;
    const c = conceptoDe(activo.key);
    return !!c && c.izqKey === e.izqKey && c.derKey === e.derKey;
  }
  function capActivo(key: string): boolean {
    if (!activo) return false;
    if (activo.tipo === 'cap') {
      if (key === activo.key) return true;
      return enlaces.some((e) => enlaceActivo(e) && (e.izqKey === key || e.derKey === key));
    }
    const c = conceptoDe(activo.key);
    return !!c && (c.izqKey === key || c.derKey === key);
  }

  const hay = activo !== null;
  const capPorKey = new Map(
    [...izquierda.capitulos, ...derecha.capitulos].map((c) => [c.key, c]),
  );

  // Contenido del panel lateral según lo que esté activo.
  const panel = (() => {
    if (!activo) return null;
    if (activo.tipo === 'concepto') {
      const c = conceptoDe(activo.key);
      if (!c) return null;
      return (
        <>
          <Link href={c.url} className="font-medium text-neutro-950 hover:text-rojo-600">
            {c.nombre}
          </Link>
          <p className="mt-1 text-sm text-neutro-500">conecta</p>
          <p className="text-sm text-neutro-700">
            {capPorKey.get(c.izqKey)?.titulo} <span className="text-neutro-400">·</span>{' '}
            {izquierda.nombre}
          </p>
          <p className="text-sm text-neutro-700">
            {capPorKey.get(c.derKey)?.titulo} <span className="text-neutro-400">·</span>{' '}
            {derecha.nombre}
          </p>
        </>
      );
    }
    // cap activo: conceptos que lo tocan
    const cs = puentes.filter((p) => p.izqKey === activo.key || p.derKey === activo.key);
    const cap = capPorKey.get(activo.key);
    return (
      <>
        <p className="font-medium text-neutro-950">{cap?.titulo}</p>
        <p className="mt-0.5 text-sm text-neutro-500">
          Conceptos que conectan este capítulo con la otra disciplina:
        </p>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {cs.map((p) => (
            <li key={p.id}>
              <Link
                href={p.url}
                className="inline-block rounded-full border border-neutro-300 px-3 py-0.5 text-sm text-neutro-700 hover:border-rojo-500 hover:text-rojo-600"
              >
                {p.nombre}
              </Link>
            </li>
          ))}
        </ul>
      </>
    );
  })();

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      <div className="min-w-0 flex-1 text-tinta">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full select-none overflow-visible"
          role="img"
          aria-label={`Mapa de conocimiento: ${izquierda.nombre} y ${derecha.nombre}`}
        >
          {/* Cabeceras de columna */}
          <text x={X_IZQ} y={20} textAnchor="end" className="fill-black/45 text-[12px] font-semibold uppercase tracking-widest">
            {izquierda.nombre}
          </text>
          <text x={X_DER} y={20} textAnchor="start" className="fill-black/45 text-[12px] font-semibold uppercase tracking-widest">
            {derecha.nombre}
          </text>

          {/* Enlaces */}
          {enlaces.map((e) => {
            const y1 = yIzq.get(e.izqKey)!;
            const y2 = yDer.get(e.derKey)!;
            const act = enlaceActivo(e);
            const dim = hay && !act;
            const sw = Math.min(1 + e.conceptos.length * 0.7, 5);
            return (
              <path
                key={e.izqKey + e.derKey}
                d={`M ${X_IZQ} ${y1} C ${(X_IZQ + X_DER) / 2} ${y1}, ${(X_IZQ + X_DER) / 2} ${y2}, ${X_DER} ${y2}`}
                fill="none"
                stroke="currentColor"
                strokeWidth={act ? sw + 0.5 : sw}
                className={`transition-opacity duration-200 ${
                  act ? 'text-acento opacity-80' : dim ? 'opacity-5' : 'opacity-20'
                }`}
              />
            );
          })}

          {/* Nodos de capítulo */}
          {[
            { caps: izquierda.capitulos, ys: yIzq, x: X_IZQ, anchor: 'end' as const, lx: X_IZQ - 14 },
            { caps: derecha.capitulos, ys: yDer, x: X_DER, anchor: 'start' as const, lx: X_DER + 14 },
          ].map((col) =>
            col.caps.map((c) => {
              const y = col.ys.get(c.key)!;
              const act = capActivo(c.key);
              const dim = hay && !act;
              return (
                <g
                  key={c.key}
                  className="cursor-pointer outline-none"
                  tabIndex={0}
                  role="button"
                  onMouseEnter={() => setActivo({ tipo: 'cap', key: c.key })}
                  onMouseLeave={() => setActivo(null)}
                  onFocus={() => setActivo({ tipo: 'cap', key: c.key })}
                  onBlur={() => setActivo(null)}
                >
                  <title>{c.titulo}</title>
                  <circle
                    cx={col.x}
                    cy={y}
                    r={act ? 6 : 4.5}
                    className={`transition-all duration-200 ${act ? 'fill-acento' : 'fill-tinta'} ${dim ? 'opacity-30' : ''}`}
                  />
                  <text
                    x={col.lx}
                    y={y}
                    textAnchor={col.anchor}
                    dominantBaseline="middle"
                    className={`text-[14px] transition-all duration-200 ${
                      act ? 'fill-acento font-medium' : 'fill-tinta'
                    } ${dim ? 'opacity-30' : 'opacity-90'}`}
                  >
                    {truncar(c.titulo)}
                  </text>
                </g>
              );
            }),
          )}
        </svg>
      </div>

      {/* Panel + leyenda de conceptos */}
      <aside className="w-full shrink-0 lg:w-72">
        <div className="min-h-[7rem] rounded-xl border border-black/10 p-5">
          {panel ?? (
            <p className="text-sm text-neutro-500">
              Cada línea es un concepto que se explica en las dos disciplinas. Pasa el
              ratón por un capítulo o por un concepto para ver cómo se conectan.
            </p>
          )}
        </div>

        <p className="eyebrow mb-2 mt-5">Conceptos puente</p>
        <ul className="flex flex-wrap gap-1.5">
          {puentes.map((p) => {
            const act = activo?.tipo === 'concepto' && activo.key === p.id;
            return (
              <li key={p.id}>
                <Link
                  href={p.url}
                  onMouseEnter={() => setActivo({ tipo: 'concepto', key: p.id })}
                  onMouseLeave={() => setActivo(null)}
                  className={`inline-block rounded-full border px-3 py-1 text-sm transition ${
                    act
                      ? 'border-rojo-500 bg-rojo-50 text-rojo-600'
                      : 'border-neutro-300 text-neutro-700 hover:border-rojo-500 hover:text-rojo-600'
                  }`}
                >
                  {p.nombre}
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>
    </div>
  );
}
