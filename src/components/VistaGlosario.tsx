'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Resaltar from './Resaltar';

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

const ETIQUETA_NIVEL: Record<string, string> = {
  basico: 'Básico',
  intermedio: 'Intermedio',
  avanzado: 'Avanzado',
};
const ORDEN_NIVEL = ['basico', 'intermedio', 'avanzado'];

const ETIQUETA_CATEGORIA: Record<string, string> = {
  reticula: 'Retícula',
  tipografia: 'Tipografía',
  maquetacion: 'Maquetación',
  composicion: 'Composición',
  'publicaciones-periodicas': 'Publicaciones periódicas',
};

function etiquetaCategoria(cat: string): string {
  return (
    ETIQUETA_CATEGORIA[cat] ??
    cat.replace(/-/g, ' ').replace(/^./, (m) => m.toUpperCase())
  );
}

/** minúsculas + sin acentos, para comparar de forma tolerante. */
function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

function inicial(nombre: string): string {
  return norm(nombre.charAt(0)).toUpperCase();
}

export default function VistaGlosario({ items }: { items: ItemGlosario[] }) {
  const [consulta, setConsulta] = useState('');
  const [cats, setCats] = useState<Set<string>>(new Set());
  const [niveles, setNiveles] = useState<Set<string>>(new Set());

  // Haystack normalizado por término (se calcula una sola vez).
  const haystacks = useMemo(() => {
    const m = new Map<string, string>();
    for (const it of items) {
      m.set(
        it.id,
        norm(
          [it.nombre, it.definicion, ...it.sinonimos, ...it.consultas].join(' '),
        ),
      );
    }
    return m;
  }, [items]);

  // Categorías y niveles presentes, con recuento absoluto.
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
    return ORDEN_NIVEL.filter((n) => c.has(n)).map(
      (n) => [n, c.get(n)!] as [string, number],
    );
  }, [items]);

  const q = norm(consulta.trim());

  const filtrados = useMemo(() => {
    return items
      .filter((it) => {
        if (cats.size && !cats.has(it.categoria)) return false;
        if (niveles.size && !niveles.has(it.nivel)) return false;
        if (q && !(haystacks.get(it.id) ?? '').includes(q)) return false;
        return true;
      })
      .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  }, [items, cats, niveles, q, haystacks]);

  const hayFiltros = consulta !== '' || cats.size > 0 || niveles.size > 0;

  function toggle(set: Set<string>, setter: (s: Set<string>) => void, v: string) {
    const next = new Set(set);
    if (next.has(v)) next.delete(v);
    else next.add(v);
    setter(next);
  }

  function limpiar() {
    setConsulta('');
    setCats(new Set());
    setNiveles(new Set());
  }

  const chipBase =
    'rounded-full border px-3 py-1 text-sm transition cursor-pointer';
  const chipOff = 'border-black/15 text-black/60 hover:border-acento';
  const chipOn = 'border-acento bg-acento/10 text-acento';

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Glosario</h1>
      <p className="mt-2 text-black/60">
        {items.length} términos de diseño, de la A a la Z.
      </p>

      {/* Barra de búsqueda interna */}
      <div className="mt-6">
        <div className="relative">
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/30"
          >
            <path
              fill="currentColor"
              d="M8 2a6 6 0 1 0 3.47 10.89l3.82 3.82 1.42-1.42-3.82-3.82A6 6 0 0 0 8 2m0 2a4 4 0 1 1 0 8 4 4 0 0 1 0-8"
            />
          </svg>
          <input
            type="search"
            value={consulta}
            onChange={(e) => setConsulta(e.target.value)}
            placeholder="Filtrar términos…"
            aria-label="Filtrar términos del glosario"
            className="w-full rounded-xl border border-black/15 bg-white py-2.5 pl-10 pr-4 outline-none focus:border-acento"
          />
        </div>
      </div>

      {/* Filtros */}
      <div className="mt-4 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-medium uppercase tracking-wide text-black/40">
            Categoría
          </span>
          {categorias.map(([cat, n]) => (
            <button
              key={cat}
              type="button"
              onClick={() => toggle(cats, setCats, cat)}
              aria-pressed={cats.has(cat)}
              className={`${chipBase} ${cats.has(cat) ? chipOn : chipOff}`}
            >
              {etiquetaCategoria(cat)}{' '}
              <span className="opacity-50">{n}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-medium uppercase tracking-wide text-black/40">
            Nivel
          </span>
          {nivelesPresentes.map(([niv, n]) => (
            <button
              key={niv}
              type="button"
              onClick={() => toggle(niveles, setNiveles, niv)}
              aria-pressed={niveles.has(niv)}
              className={`${chipBase} ${niveles.has(niv) ? chipOn : chipOff}`}
            >
              {ETIQUETA_NIVEL[niv] ?? niv} <span className="opacity-50">{n}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recuento + limpiar */}
      <div className="mt-5 flex items-center justify-between border-b border-black/10 pb-2 text-sm text-black/50">
        <span>
          {filtrados.length}{' '}
          {filtrados.length === 1 ? 'término' : 'términos'}
          {hayFiltros ? ` de ${items.length}` : ''}
        </span>
        {hayFiltros && (
          <button
            type="button"
            onClick={limpiar}
            className="text-acento hover:underline"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Listado A–Z */}
      {filtrados.length === 0 ? (
        <div className="mt-10 text-center text-black/50">
          <p>No hay términos que coincidan con estos filtros.</p>
          <button
            type="button"
            onClick={limpiar}
            className="mt-2 text-acento hover:underline"
          >
            Quitar filtros
          </button>
        </div>
      ) : (
        <ul className="mt-2 flex flex-col divide-y divide-black/10">
          {filtrados.map((c, i) => {
            const letra = inicial(c.nombre);
            const mostrarLetra = i === 0 || inicial(filtrados[i - 1].nombre) !== letra;
            return (
              <li key={c.id} className="py-3">
                {mostrarLetra && (
                  <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-black/30">
                    {letra}
                  </div>
                )}
                <Link
                  href={`/glosario/${c.disciplina}/${c.id}/`}
                  className="group block"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-medium group-hover:text-acento">
                      <Resaltar texto={c.nombre} consulta={consulta} />
                    </span>
                    <span className="shrink-0 text-xs uppercase tracking-wide text-black/40">
                      {etiquetaCategoria(c.categoria)}
                    </span>
                  </div>
                  <p className="text-sm text-black/60">
                    <Resaltar texto={c.definicion} consulta={consulta} />
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
