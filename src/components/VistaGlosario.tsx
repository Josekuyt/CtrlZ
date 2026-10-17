'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Resaltar from './Resaltar';
import { etiquetaCategoria, etiquetaNivel, ORDEN_NIVEL } from '@/lib/etiquetas';

export type ItemGlosario = {
  id: string;
  nombre: string;
  definicion: string;
  categoria: string;
  nivel: string;
  disciplina: string;
  sinonimos: string[];
  consultas: string[];
};

function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}
function inicial(nombre: string): string {
  return norm(nombre.charAt(0)).toUpperCase();
}

const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function VistaGlosario({ items }: { items: ItemGlosario[] }) {
  const [consulta, setConsulta] = useState('');
  const [letra, setLetra] = useState('todo');
  const [cat, setCat] = useState('todo');
  const [nivel, setNivel] = useState('todo');

  const haystacks = useMemo(() => {
    const m = new Map<string, string>();
    for (const it of items) {
      m.set(it.id, norm([it.nombre, it.definicion, ...it.sinonimos, ...it.consultas].join(' ')));
    }
    return m;
  }, [items]);

  const categorias = useMemo(() => {
    const c = new Map<string, number>();
    for (const it of items) c.set(it.categoria, (c.get(it.categoria) ?? 0) + 1);
    return [...c.entries()].sort((a, b) =>
      etiquetaCategoria(a[0]).localeCompare(etiquetaCategoria(b[0]), 'es'),
    );
  }, [items]);

  const nivelesPresentes = useMemo(() => {
    const c = new Map<string, number>();
    for (const it of items) c.set(it.nivel, (c.get(it.nivel) ?? 0) + 1);
    return ORDEN_NIVEL.filter((n) => c.has(n)).map((n) => [n, c.get(n)!] as [string, number]);
  }, [items]);

  const inicialesPresentes = useMemo(() => {
    const s = new Set<string>();
    for (const it of items) s.add(inicial(it.nombre));
    return s;
  }, [items]);

  const q = norm(consulta.trim());

  const filtrados = useMemo(() => {
    return items
      .filter((it) => {
        if (letra !== 'todo' && inicial(it.nombre) !== letra) return false;
        if (cat !== 'todo' && it.categoria !== cat) return false;
        if (nivel !== 'todo' && it.nivel !== nivel) return false;
        if (q && !(haystacks.get(it.id) ?? '').includes(q)) return false;
        return true;
      })
      .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  }, [items, letra, cat, nivel, q, haystacks]);

  return (
    <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-10">
      {/* Panel lateral de filtros */}
      <aside className="mb-8 lg:mb-0">
        <div className="flex flex-col gap-6 lg:sticky lg:top-24">
          {/* Buscar */}
          <div>
            <label htmlFor="g-buscar" className="eyebrow mb-2 block">
              Buscar un término
            </label>
            <input
              id="g-buscar"
              type="search"
              value={consulta}
              onChange={(e) => setConsulta(e.target.value)}
              placeholder="Filtrar términos…"
              className="w-full rounded-lg border border-neutro-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-rojo-500 focus:ring-2 focus:ring-rojo-500/15"
            />
          </div>

          {/* Alfabeto */}
          <div>
            <p className="eyebrow mb-2">Alfabeto</p>
            <button
              onClick={() => setLetra('todo')}
              className={`mb-2 rounded-md px-3 py-1 text-sm transition ${
                letra === 'todo' ? 'bg-rojo-50 font-medium text-rojo-600' : 'text-neutro-600 hover:bg-neutro-50'
              }`}
            >
              Todo
            </button>
            <div className="grid grid-cols-7 gap-1">
              {ABC.map((l) => {
                const hay = inicialesPresentes.has(l);
                const activo = letra === l;
                return (
                  <button
                    key={l}
                    disabled={!hay}
                    onClick={() => setLetra(activo ? 'todo' : l)}
                    className={`flex h-7 items-center justify-center rounded text-sm transition ${
                      activo
                        ? 'bg-rojo-500 font-medium text-white'
                        : hay
                          ? 'text-neutro-700 hover:bg-neutro-100'
                          : 'cursor-default text-neutro-300'
                    }`}
                  >
                    {l}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Categorías */}
          <div>
            <label htmlFor="g-cat" className="eyebrow mb-2 block">
              Categorías
            </label>
            <select
              id="g-cat"
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              className="w-full rounded-lg border border-neutro-200 bg-white px-3 py-2 text-sm text-neutro-700 outline-none transition focus:border-rojo-500"
            >
              <option value="todo">Todas las categorías</option>
              {categorias.map(([c, n]) => (
                <option key={c} value={c}>
                  {etiquetaCategoria(c)} ({n})
                </option>
              ))}
            </select>
          </div>

          {/* Nivel */}
          <div>
            <p className="eyebrow mb-2 px-1">Nivel</p>
            <NivelOpcion label="Todo" n={items.length} activo={nivel === 'todo'} onClick={() => setNivel('todo')} />
            {nivelesPresentes.map(([niv, n]) => (
              <NivelOpcion
                key={niv}
                label={etiquetaNivel(niv)}
                n={n}
                activo={nivel === niv}
                onClick={() => setNivel(nivel === niv ? 'todo' : niv)}
              />
            ))}
          </div>
        </div>
      </aside>

      {/* Listado de términos */}
      <div className="min-w-0">
        <h1 className="text-4xl font-semibold tracking-tight text-neutro-950">Glosario</h1>
        <p className="mt-1 text-neutro-500">
          {filtrados.length} {filtrados.length === 1 ? 'término' : 'términos'}
        </p>

        {filtrados.length === 0 ? (
          <div className="mt-10 text-neutro-500">
            <p>No hay términos que coincidan con estos filtros.</p>
          </div>
        ) : (
          <div className="mt-8 flex flex-col gap-8">
            {agrupar(filtrados).map(({ letra: L, terminos }) => (
              <section key={L}>
                <h2 className="mb-3 text-2xl font-semibold text-neutro-950">{L}</h2>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {terminos.map((c) => (
                    <Link
                      key={c.id}
                      href={`/glosario/${c.disciplina}/${c.id}/`}
                      className="group flex flex-col rounded-xl border border-neutro-200 bg-white p-5 transition hover:border-neutro-300 hover:shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-neutro-950 group-hover:text-rojo-600">
                          <Resaltar texto={c.nombre} consulta={consulta} />
                        </h3>
                        <span className="shrink-0 rounded bg-neutro-100 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-neutro-500">
                          {etiquetaCategoria(c.categoria)}
                        </span>
                      </div>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-neutro-600">
                        <Resaltar texto={c.definicion} consulta={consulta} />
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-rojo-600">
                        Ver término <span aria-hidden="true">→</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function NivelOpcion({
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
        activo ? 'bg-rojo-50 font-medium text-rojo-600' : 'text-neutro-700 hover:bg-neutro-50'
      }`}
    >
      <span>{label}</span>
      <span className={`text-xs ${activo ? 'text-rojo-500' : 'text-neutro-400'}`}>{n}</span>
    </button>
  );
}

function agrupar(items: ItemGlosario[]): { letra: string; terminos: ItemGlosario[] }[] {
  const grupos: { letra: string; terminos: ItemGlosario[] }[] = [];
  for (const it of items) {
    const L = inicial(it.nombre);
    const ultimo = grupos[grupos.length - 1];
    if (ultimo && ultimo.letra === L) ultimo.terminos.push(it);
    else grupos.push({ letra: L, terminos: [it] });
  }
  return grupos;
}
