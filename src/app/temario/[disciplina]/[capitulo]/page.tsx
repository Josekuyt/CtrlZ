import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  cargarTemario,
  obtenerDisciplina,
  obtenerCapitulo,
  nombreDisciplina,
} from '@/lib/temario';
import RailCapitulo from '@/components/RailCapitulo';

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
  const d = obtenerDisciplina(disciplina);
  const cap = obtenerCapitulo(disciplina, capitulo);
  if (!d || !cap) notFound();

  // Capítulo anterior / siguiente para navegar sin volver al índice.
  const i = d.capitulos.findIndex((c) => c.slug === cap.slug);
  const anterior = d.capitulos[i - 1];
  const siguiente = d.capitulos[i + 1];

  const secciones = cap.apartados.map((a) => ({ slug: a.slug, titulo: a.titulo }));

  return (
    <div className="lg:grid lg:grid-cols-[180px_1fr] lg:gap-10">
      {/* Riel de secciones (solo escritorio) */}
      <div className="hidden lg:block">
        <div className="sticky top-6">
          <RailCapitulo secciones={secciones} />
        </div>
      </div>

      <article className="min-w-0">
        <nav className="text-sm text-black/40 mb-2">
          <Link href="/temario/" className="hover:text-acento">Temario</Link>
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

        {/* Todos los apartados seguidos, cada uno anclado por su slug */}
        {cap.apartados.map((ap) => (
          <section
            key={ap.slug}
            id={ap.slug}
            className="prose-ctrlz scroll-mt-20 mt-12 border-t border-black/10 pt-8 first:border-0 first:pt-0"
            dangerouslySetInnerHTML={{ __html: ap.html }}
          />
        ))}

        <div className="mt-12 flex justify-between gap-4 border-t border-black/10 pt-4 text-sm">
          {anterior ? (
            <Link
              href={`/temario/${disciplina}/${anterior.slug}/`}
              className="text-acento hover:underline"
            >
              ← {anterior.titulo}
            </Link>
          ) : (
            <span />
          )}
          {siguiente ? (
            <Link
              href={`/temario/${disciplina}/${siguiente.slug}/`}
              className="text-acento hover:underline text-right"
            >
              {siguiente.titulo} →
            </Link>
          ) : (
            <span />
          )}
        </div>
      </article>
    </div>
  );
}
