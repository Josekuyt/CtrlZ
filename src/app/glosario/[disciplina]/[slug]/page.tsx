import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { obtenerGrafo } from '@/lib/datos';
import FichaConcepto from '@/components/FichaConcepto';

type Params = { disciplina: string; slug: string };

export function generateStaticParams(): Params[] {
  return [...obtenerGrafo().values()].map((c) => ({
    disciplina: c.disciplina,
    slug: c.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = obtenerGrafo().get(slug);
  if (!c) return {};
  return { title: c.nombre, description: c.definicion };
}

export default async function TerminoPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const grafo = obtenerGrafo();
  const concepto = grafo.get(slug);
  if (!concepto) notFound();

  return <FichaConcepto concepto={concepto} grafo={grafo} />;
}
