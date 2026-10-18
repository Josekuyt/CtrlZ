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

  const nav = (
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
  );

  return (
    <header className="sticky top-0 z-20 border-b border-neutro-200 bg-white/90 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Fila principal: logo + (buscador centrado en escritorio) + nav */}
        <div className="flex h-16 items-center gap-4 sm:gap-6">
          <Logo />
          <div className="hidden flex-1 justify-center md:flex">
            {!sinBuscador && (
              <div className="w-full max-w-xl">
                <CajaBusqueda compacto globalHotkey />
              </div>
            )}
          </div>
          <div className="ml-auto md:ml-0">{nav}</div>
        </div>

        {/* Buscador a todo el ancho en móvil */}
        {!sinBuscador && (
          <div className="pb-3 md:hidden">
            <CajaBusqueda compacto />
          </div>
        )}
      </div>
    </header>
  );
}
