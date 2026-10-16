import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cargarTemario, obtenerDisciplina, nombreDisciplina } from '@/lib/temario';
import VistaTemario from '@/components/VistaTemario';

type Params = { disciplina: string };

export function generateStaticParams(): Params[] {
  return cargarTemario().map((d) => ({ disciplina: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { disciplina } = await params;
  return { title: `Temario · ${nombreDisciplina(disciplina)}` };
}

export default async function DisciplinaPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { disciplina } = await params;
  if (!obtenerDisciplina(disciplina)) notFound();
  return <VistaTemario disciplinaActiva={disciplina} />;
}
