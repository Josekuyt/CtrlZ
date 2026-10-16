'use client';

import { usePathname } from 'next/navigation';
import CajaBusqueda from './CajaBusqueda';

/** Buscador compacto en la cabecera; oculto en el Inicio (que ya tiene el grande). */
export default function BuscadorCabecera() {
  const path = usePathname();
  if (path === '/') return null;
  return (
    <div className="hidden sm:block w-48">
      <CajaBusqueda compacto globalHotkey />
    </div>
  );
}
