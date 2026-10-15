'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ArbolTemario } from '@/lib/temario';

export default function MenuLateral({
  disciplina,
  arbol,
}: {
  disciplina: string;
  arbol: ArbolTemario;
}) {
  const path = usePathname();

  return (
    <nav
      aria-label="Temario"
      className="text-sm md:sticky md:top-6 self-start border-b md:border-b-0 md:border-r border-black/10 pb-6 md:pb-0 md:pr-6"
    >
      <p className="font-semibold uppercase tracking-wide text-xs text-black/40 mb-3">
        Temario
      </p>
      <ul className="flex flex-col gap-4">
        {arbol.map((cap) => (
          <li key={cap.slug}>
            <Link
              href={`/temario/${disciplina}/${cap.slug}/`}
              className="font-medium hover:text-acento"
            >
              {cap.titulo}
            </Link>
            <ul className="mt-1 flex flex-col gap-1 border-l border-black/10 pl-3">
              {cap.apartados.map((ap) => {
                const href = `/temario/${disciplina}/${cap.slug}/${ap.slug}/`;
                const activo = path === href;
                return (
                  <li key={ap.slug}>
                    <Link
                      href={href}
                      aria-current={activo ? 'page' : undefined}
                      className={
                        activo
                          ? 'text-acento font-medium'
                          : 'text-black/60 hover:text-acento'
                      }
                    >
                      {ap.titulo}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  );
}
