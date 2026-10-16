import type { Metadata } from 'next';
import { cargarTemario } from '@/lib/temario';
import VistaTemario from '@/components/VistaTemario';

export const metadata: Metadata = {
  title: 'Temario',
  description: 'Temario navegable de diseño, por disciplinas.',
};

export default function TemarioIndex() {
  const primera = cargarTemario()[0];
  return <VistaTemario disciplinaActiva={primera?.slug ?? 'editorial'} />;
}
