'use client';

import { useState } from 'react';
import Link from 'next/link';

export type TerminoNodo = { id: string; nombre: string; url: string };
export type CapituloNodo = {
  slug: string;
  titulo: string;
  url: string;
  terminos: TerminoNodo[];
};

type Props = {
  centro: string;
  capitulos: CapituloNodo[];
};

const W = 920;
const H = 620;
const CX = W / 2;
const CY = H / 2;
const R1 = 205;
const RAD = Math.PI / 180;

function pos(r: number, deg: number) {
  const a = deg * RAD;
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) };
}

export default function GrafoConocimiento({ centro, capitulos }: Props) {
  const [sel, setSel] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const n = capitulos.length;
  const activo = hover ?? sel;
  const seleccionado = capitulos.find((c) => c.slug === sel) ?? null;

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
      <div className="min-w-0 flex-1 text-tinta">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full select-none overflow-visible"
          role="img"
          aria-label={`Mapa de conocimiento de ${centro}`}
        >
          {capitulos.map((cap, i) => {
            const deg = -90 + (360 / n) * i;
            const p = pos(R1, deg);
            const act = activo === cap.slug;
            const dim = activo !== null && !act;
            const esSel = sel === cap.slug;
            return (
              <line
                key={`l-${cap.slug}`}
                x1={CX}
                y1={CY}
                x2={p.x}
                y2={p.y}
                stroke="currentColor"
                strokeWidth={act ? 1.5 : 1}
                className={`transition-opacity duration-200 ${
                  esSel ? 'text-acento' : 'text-tinta'
                } ${dim ? 'opacity-10' : act ? 'opacity-70' : 'opacity-25'}`}
              />
            );
          })}

          <rect x={CX - 7} y={CY - 7} width={14} height={14} className="fill-tinta" />
          <text
            x={CX}
            y={CY + 26}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-black/45 text-[11px] uppercase tracking-widest"
          >
            {centro}
          </text>

          {capitulos.map((cap, i) => {
            const deg = -90 + (360 / n) * i;
            const p = pos(R1, deg);
            const derecha = Math.cos(deg * RAD) >= 0;
            const arriba = Math.sin(deg * RAD) < -0.8;
            const act = activo === cap.slug;
            const esSel = sel === cap.slug;
            const dim = activo !== null && !act;
            const lx = p.x + (derecha ? 12 : -12);
            const anchor = arriba ? 'middle' : derecha ? 'start' : 'end';
            return (
              <g
                key={`c-${cap.slug}`}
                role="button"
                tabIndex={0}
                aria-pressed={esSel}
                className="cursor-pointer outline-none"
                onClick={() => setSel(esSel ? null : cap.slug)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSel(esSel ? null : cap.slug);
                  }
                }}
                onMouseEnter={() => setHover(cap.slug)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(cap.slug)}
                onBlur={() => setHover(null)}
              >
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={act || esSel ? 4.5 : 3}
                  className={`transition-all duration-200 ${
                    esSel || act ? 'fill-acento' : 'fill-tinta'
                  } ${dim ? 'opacity-30' : ''}`}
                />
                <text
                  x={lx}
                  y={p.y + (arriba ? -14 : 0)}
                  textAnchor={anchor}
                  dominantBaseline="middle"
                  className={`text-[15px] font-medium uppercase tracking-wide transition-all duration-200 ${
                    esSel || act ? 'fill-acento' : 'fill-tinta'
                  } ${dim ? 'opacity-30' : ''}`}
                >
                  {cap.titulo}
                </text>
                <text
                  x={lx}
                  y={p.y + (arriba ? -14 : 0) + 15}
                  textAnchor={anchor}
                  dominantBaseline="middle"
                  className={`fill-black/35 text-[10px] transition-opacity duration-200 ${
                    dim ? 'opacity-20' : 'opacity-100'
                  }`}
                >
                  {cap.terminos.length}{' '}
                  {cap.terminos.length === 1 ? 'término' : 'términos'}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Panel del capítulo seleccionado */}
      <aside className="w-full shrink-0 lg:w-64">
        {seleccionado ? (
          <div className="rounded-xl border border-black/10 p-5">
            <Link
              href={seleccionado.url}
              className="group flex items-baseline justify-between gap-2"
            >
              <span className="font-medium group-hover:text-acento">
                {seleccionado.titulo}
              </span>
              <span className="shrink-0 text-xs text-acento">Abrir →</span>
            </Link>
            {seleccionado.terminos.length > 0 ? (
              <ul className="mt-4 flex flex-wrap gap-2">
                {seleccionado.terminos.map((t) => (
                  <li key={t.id}>
                    <Link
                      href={t.url}
                      className="inline-block rounded-full border border-black/15 px-3 py-1 text-sm text-black/70 transition hover:border-acento hover:text-acento"
                    >
                      {t.nombre}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-black/50">
                Aún no hay términos de glosario en este capítulo.
              </p>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-black/15 p-5 text-sm text-black/50">
            Pulsa un capítulo para ver sus términos de glosario. Pulsa de nuevo
            para cerrarlo.
          </div>
        )}
      </aside>
    </div>
  );
}
