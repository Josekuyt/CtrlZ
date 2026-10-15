import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cargarTemario, obtenerCapitulo, nombreDisciplina } from '@/lib/temario';

type Params = { disciplina: string; capitulo: string };

export function generateStaticParams(): Params[] {
  const params: Params[] = [];
  for (const d of cargarTemario()) {
    for (const cap of d.capitulos) {
      params.push({ disciplina: d.slug, capitulo: cap.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { disciplina, capitulo } = await params;
  const cap = obtenerCapitulo(disciplina, capitulo);
  return cap ? { title: cap.titulo, description: cap.descripcion } : {};
}

export default async function CapituloPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { disciplina, capitulo } = await params;
  const cap = obtenerCapitulo(disciplina, capitulo);
  if (!cap) notFound();

  return (
    <article>
      <nav className="text-sm text-black/40 mb-2">
        <Link href="/temario/" className="hover:text-acento">
          Temario
        </Link>
        <span className="mx-2">›</span>
        <Link href={`/temario/${disciplina}/`} className="hover:text-acento">
          {nombreDisciplina(disciplina)}
        </Link>
      </nav>
      <h1 className="text-3xl font-semibold tracking-tight">{cap.titulo}</h1>

      {cap.intro && (
        <div
          className="prose-ctrlz mt-4 text-black/80"
          dangerouslySetInnerHTML={{ __html: cap.intro }}
        />
      )}

      <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-black/40">
        Apartados
      </h2>
      <ol className="mt-2 flex flex-col gap-1 list-decimal pl-5">
        {cap.apartados.map((ap) => (
          <li key={ap.slug}>
            <Link
              href={`/temario/${disciplina}/${cap.slug}/${ap.slug}/`}
              className="hover:text-acento"
            >
              {ap.titulo}
            </Link>
          </li>
        ))}
      </ol>
    </article>
  );
}
