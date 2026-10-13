'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CajaBusqueda({
  valorInicial = '',
  autoFocus = false,
}: {
  valorInicial?: string;
  autoFocus?: boolean;
}) {
  const router = useRouter();
  const [q, setQ] = useState(valorInicial);

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    const t = q.trim();
    if (t) router.push(`/buscar/?q=${encodeURIComponent(t)}`);
  }

  return (
    <form onSubmit={enviar} role="search" className="w-full">
      <label htmlFor="q" className="sr-only">
        Escribe tu duda de diseño
      </label>
      <div className="flex gap-2">
        <input
          id="q"
          name="q"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={autoFocus}
          placeholder="Escribe una duda o describe la idea…"
          className="flex-1 rounded-lg border border-black/15 px-4 py-3 text-base outline-none focus:border-acento focus:ring-2 focus:ring-acento/30"
        />
        <button
          type="submit"
          className="rounded-lg bg-acento px-5 py-3 text-white font-medium hover:opacity-90"
        >
          Buscar
        </button>
      </div>
    </form>
  );
}
