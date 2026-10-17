'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { buscar, type Resultado } from '@/lib/busqueda';

function IconoLupa({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export default function CajaBusqueda({
  valorInicial = '',
  autoFocus = false,
  compacto = false,
  globalHotkey = false,
}: {
  valorInicial?: string;
  autoFocus?: boolean;
  compacto?: boolean;
  globalHotkey?: boolean;
}) {
  const router = useRouter();
  const [q, setQ] = useState(valorInicial);
  const [sugerencias, setSugerencias] = useState<Resultado[]>([]);
  const [abierto, setAbierto] = useState(false);
  const [activo, setActivo] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const cajaRef = useRef<HTMLDivElement>(null);
  // Evita abrir el desplegable al cargar con un valor prellenado (p. ej. /buscar).
  const interactuado = useRef(false);

  useEffect(() => {
    const t = q.trim();
    if (t.length < 2) {
      setSugerencias([]);
      setAbierto(false);
      return;
    }
    let activoFlag = true;
    const id = setTimeout(() => {
      buscar(t, 6).then((r) => {
        if (!activoFlag) return;
        setSugerencias(r);
        setAbierto(r.length > 0 && interactuado.current);
        setActivo(-1);
      });
    }, 120);
    return () => {
      activoFlag = false;
      clearTimeout(id);
    };
  }, [q]);

  useEffect(() => {
    function fuera(e: MouseEvent) {
      if (cajaRef.current && !cajaRef.current.contains(e.target as Node)) {
        setAbierto(false);
      }
    }
    document.addEventListener('mousedown', fuera);
    return () => document.removeEventListener('mousedown', fuera);
  }, []);

  useEffect(() => {
    if (!globalHotkey) return;
    function onKey(e: KeyboardEvent) {
      const el = document.activeElement;
      const escribiendo =
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        (el as HTMLElement)?.isContentEditable;
      if (e.key === '/' && !escribiendo) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [globalHotkey]);

  function irABuscar(termino: string) {
    const t = termino.trim();
    if (t) router.push(`/buscar/?q=${encodeURIComponent(t)}`);
    setAbierto(false);
  }

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (activo >= 0 && sugerencias[activo]) {
      router.push(sugerencias[activo].url);
      setAbierto(false);
    } else {
      irABuscar(q);
    }
  }

  function teclado(e: React.KeyboardEvent) {
    if (!abierto) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActivo((i) => Math.min(i + 1, sugerencias.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActivo((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Escape') {
      setAbierto(false);
    }
  }

  const alto = compacto ? 'h-11 px-3.5' : 'h-14 px-5';

  return (
    <div ref={cajaRef} className="relative w-full">
      <form onSubmit={enviar} role="search">
        <label htmlFor="q" className="sr-only">
          Escribe tu duda de diseño
        </label>
        <div
          className={`flex items-center gap-3 rounded-xl border border-neutro-200 bg-white ${alto} transition focus-within:border-rojo-500 focus-within:ring-2 focus-within:ring-rojo-500/15`}
        >
          <kbd className="hidden h-6 w-6 shrink-0 items-center justify-center rounded border border-neutro-300 font-mono text-sm text-neutro-500 sm:flex">
            /
          </kbd>
          <input
            ref={inputRef}
            id="q"
            name="q"
            type="search"
            value={q}
            onChange={(e) => {
              interactuado.current = true;
              setQ(e.target.value);
            }}
            onKeyDown={teclado}
            onFocus={() => sugerencias.length > 0 && setAbierto(true)}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={autoFocus}
            autoComplete="off"
            role="combobox"
            aria-expanded={abierto}
            aria-controls="sugerencias"
            placeholder="¿Qué necesitas saber?"
            className={`min-w-0 flex-1 bg-transparent text-neutro-900 outline-none placeholder:text-neutro-400 ${
              compacto ? 'text-sm' : 'text-base'
            } [&::-webkit-search-cancel-button]:appearance-none`}
          />
          <button
            type="submit"
            aria-label="Buscar"
            className="shrink-0 text-neutro-500 transition hover:text-rojo-500"
          >
            <IconoLupa className={compacto ? 'h-4 w-4' : 'h-5 w-5'} />
          </button>
        </div>
      </form>

      {abierto && sugerencias.length > 0 && (
        <ul
          id="sugerencias"
          role="listbox"
          className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-neutro-200 bg-white text-left shadow-lg"
        >
          {sugerencias.map((s, i) => (
            <li key={s.id} role="option" aria-selected={i === activo}>
              <button
                type="button"
                onMouseEnter={() => setActivo(i)}
                onClick={() => router.push(s.url)}
                className={`flex w-full items-baseline justify-between gap-3 px-4 py-2.5 text-left ${
                  i === activo ? 'bg-rojo-50' : 'hover:bg-neutro-50'
                }`}
              >
                <span className="truncate text-sm text-neutro-900">{s.titulo}</span>
                <span className="shrink-0 font-mono text-[10px] uppercase tracking-wide text-neutro-400">
                  {s.tipo}
                </span>
              </button>
            </li>
          ))}
          <li className="border-t border-neutro-100">
            <button
              type="button"
              onClick={() => irABuscar(q)}
              className="w-full px-4 py-2.5 text-left text-xs font-medium text-rojo-600 hover:bg-neutro-50"
            >
              Ver todos los resultados de «{q.trim()}» →
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
