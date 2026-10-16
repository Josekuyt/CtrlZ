import type { Metadata } from 'next';
import { obtenerTodos } from '@/lib/datos';
import VistaGlosario, { type ItemGlosario } from '@/components/VistaGlosario';

export const metadata: Metadata = {
  title: 'Glosario',
  description: 'Todos los términos de diseño, de la A a la Z.',
};

export default function GlosarioIndex() {
  const items: ItemGlosario[] = obtenerTodos().map((c) => ({
    id: c.id,
    nombre: c.nombre,
    definicion: c.definicion,
    categoria: c.categoria,
    nivel: c.nivel,
    disciplina: c.disciplina,
    sinonimos: c.sinonimos,
    consultas: c.consultas,
  }));

  return <VistaGlosario items={items} />;
}
