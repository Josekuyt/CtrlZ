import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  cargarTemario,
  obtenerCapitulo,
  obtenerApartado,
  nombreDisciplina,
} from '@/lib/temario';

type Params = { disciplina: string; capitulo: string; apartado: string };

export function generateStaticParams(): Params[] {
  const params: Params[] = [];
  for (const d of cargarTemario()) {
    for (const cap of d.capitulos) {
      for (const ap of cap.apartados) {
        params.push({ disciplina: d.slug, capitulo: cap.slug, apartado: ap.slug });
      }
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { disciplina, capitulo, apartado } = await params;
  const ap = obtenerApartado(disciplina, capitulo, apartado);
  if (!ap) return {};
  return { title: ap.titulo, description: ap.texto.slice(0, 150) };
}

export default async function ApartadoPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { disciplina, capitulo, apartado } = await params;
  const cap = obtenerCapitulo(disciplina, capitulo);
  const ap = obtenerApartado(disciplina, capitulo, apartado);
  if (!cap || !ap) notFound();

  const i = cap.apartados.findIndex((a) => a.slug === ap.slug);
  const anterior = cap.apartados[i - 1];
  const siguiente = cap.apartados[i + 1];
  const base = `/temario/${disciplina}/${cap.slug}`;

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
        <span className="mx-2">›</span>
        <Link href={`${base}/`} className="hover:text-acento">
          {cap.titulo}
        </Link>
      </nav>

      <div className="prose-ctrlz" dangerouslySetInnerHTML={{ __html: ap.html }} />

      <div className="mt-10 flex justify-between gap-4 border-t border-black/10 pt-4 text-sm">
        {anterior ? (
          <Link href={`${base}/${anterior.slug}/`} className="text-acento hover:underline">
            ← {anterior.titulo}
          </Link>
        ) : (
          <span />
        )}
        {siguiente ? (
          <Link
            href={`${base}/${siguiente.slug}/`}
            className="text-acento hover:underline text-right"
          >
            {siguiente.titulo} →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </article>
  );
}
