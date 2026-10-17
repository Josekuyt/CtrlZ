'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import CajaBusqueda from './CajaBusqueda';

const ENLACES = [
  { href: '/temario', label: 'Temario' },
  { href: '/glosario', label: 'Glosario' },
  { href: '/grafo', label: 'Mapa' },
];

export default function Header() {
  const path = usePathname();
  // El Inicio tiene el buscador como héroe; /buscar lo lleva en el cuerpo.
  const sinBuscador = path === '/' || path === '/buscar';

  return (
    <header className="sticky top-0 z-20 border-b border-neutro-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-6 sm:gap-6">
        <Logo />

        <div className="flex flex-1 justify-center">
          {!sinBuscador && (
            <div className="w-full max-w-xl">
              <CajaBusqueda compacto globalHotkey />
            </div>
          )}
        </div>

        <nav className="flex items-center gap-4 text-sm font-medium text-neutro-700 sm:gap-6">
          {ENLACES.map((e) => {
            const activo = path === e.href || path.startsWith(e.href + '/');
            return (
              <Link
                key={e.href}
                href={e.href}
                className={activo ? 'text-rojo-600' : 'hover:text-rojo-500'}
              >
                {e.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
