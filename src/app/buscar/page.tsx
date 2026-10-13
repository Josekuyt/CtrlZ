import { Suspense } from 'react';
import type { Metadata } from 'next';
import Resultados from '@/components/Resultados';

export const metadata: Metadata = {
  title: 'Buscar',
  description: 'Busca conceptos de diseño por nombre o describiendo la idea.',
};

export default function BuscarPage() {
  return (
    <Suspense fallback={<p className="text-black/50">Cargando buscador…</p>}>
      <Resultados />
    </Suspense>
  );
}
