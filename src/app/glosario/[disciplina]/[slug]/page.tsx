import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { obtenerGrafo, obtenerTodos } from '@/lib/datos';
import FichaConcepto from '@/components/FichaConcepto';
import JsonLd from '@/components/JsonLd';
import { nombreDisciplina } from '@/lib/temario';
import { SITE_URL, SITE_NAME } from '@/lib/site';

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
  const ruta = `/glosario/${c.disciplina}/${c.id}/`;
  return {
    title: c.nombre,
    description: c.definicion,
    alternates: { canonical: ruta },
    openGraph: {
      type: 'article',
      url: ruta,
      title: c.nombre,
      description: c.definicion,
    },
  };
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

  // Vecinos en el orden alfabético global del glosario.
  const todos = obtenerTodos();
  const i = todos.findIndex((c) => c.id === slug);
  const anterior = i > 0 ? todos[i - 1] : undefined;
  const siguiente = i >= 0 && i < todos.length - 1 ? todos[i + 1] : undefined;

  const ruta = `${SITE_URL}/glosario/${concepto.disciplina}/${concepto.id}/`;
  const terminoLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: concepto.nombre,
    description: concepto.definicion,
    url: ruta,
    inLanguage: 'es',
    ...(concepto.sinonimos.length > 0 ? { alternateName: concepto.sinonimos } : {}),
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: `Glosario de ${SITE_NAME}`,
      url: `${SITE_URL}/glosario/`,
    },
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Glosario', item: `${SITE_URL}/glosario/` },
      {
        '@type': 'ListItem',
        position: 2,
        name: nombreDisciplina(concepto.disciplina),
        item: `${SITE_URL}/glosario/${concepto.disciplina}/`,
      },
      { '@type': 'ListItem', position: 3, name: concepto.nombre, item: ruta },
    ],
  };

  return (
    <>
      <JsonLd data={terminoLd} />
      <JsonLd data={breadcrumbLd} />
      <FichaConcepto
      concepto={concepto}
      grafo={grafo}
      anterior={
        anterior && {
          id: anterior.id,
          nombre: anterior.nombre,
          disciplina: anterior.disciplina,
        }
      }
      siguiente={
        siguiente && {
          id: siguiente.id,
          nombre: siguiente.nombre,
          disciplina: siguiente.disciplina,
        }
      }
      />
    </>
  );
}
