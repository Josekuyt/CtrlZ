'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { buscar, type Resultado } from '@/lib/busqueda';

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

  // Autocompletar (con pequeño retardo para no buscar en cada tecla).
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
        setAbierto(r.length > 0);
        setActivo(-1);
      });
    }, 120);
    return () => {
      activoFlag = false;
      clearTimeout(id);
    };
  }, [q]);

  // Cerrar al hacer clic fuera.
  useEffect(() => {
    function fuera(e: MouseEvent) {
      if (cajaRef.current && !cajaRef.current.contains(e.target as Node)) {
        setAbierto(false);
      }
    }
    document.addEventListener('mousedown', fuera);
    return () => document.removeEventListener('mousedown', fuera);
  }, []);

  // Atajo "/" para enfocar el buscador.
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

  const alto = compacto ? 'py-1.5 text-sm' : 'py-3 text-base';

  return (
    <div ref={cajaRef} className="relative w-full">
      <form onSubmit={enviar} role="search">
        <label htmlFor="q" className="sr-only">
          Escribe tu duda de diseño
        </label>
        <div className="flex gap-2">
          <input
            ref={inputRef}
            id="q"
            name="q"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={teclado}
            onFocus={() => sugerencias.length > 0 && setAbierto(true)}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={autoFocus}
            autoComplete="off"
            role="combobox"
            aria-expanded={abierto}
            aria-controls="sugerencias"
            placeholder={compacto ? 'Buscar…' : 'Escribe una duda o describe la idea…'}
            className={`flex-1 rounded-lg border border-black/15 px-4 ${alto} outline-none focus:border-acento focus:ring-2 focus:ring-acento/30`}
          />
          {!compacto && (
            <button
              type="submit"
              className="rounded-lg bg-acento px-5 py-3 text-white font-medium hover:opacity-90"
            >
              Buscar
            </button>
          )}
        </div>
      </form>

      {abierto && sugerencias.length > 0 && (
        <ul
          id="sugerencias"
          role="listbox"
          className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-black/15 bg-white shadow-lg text-left"
        >
          {sugerencias.map((s, i) => (
            <li key={s.id} role="option" aria-selected={i === activo}>
              <button
                type="button"
                onMouseEnter={() => setActivo(i)}
                onClick={() => router.push(s.url)}
                className={`flex w-full items-baseline justify-between gap-3 px-4 py-2 text-left ${
                  i === activo ? 'bg-acento/10' : 'hover:bg-black/5'
                }`}
              >
                <span className="truncate text-sm">{s.titulo}</span>
                <span className="shrink-0 text-[10px] uppercase tracking-wide text-black/40">
                  {s.tipo}
                </span>
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={() => irABuscar(q)}
              className="w-full px-4 py-2 text-left text-xs text-acento hover:bg-black/5"
            >
              Ver todos los resultados de «{q.trim()}» →
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
