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
import TerminosApartado from '@/components/TerminosApartado';
import { terminosPorApartado } from '@/lib/datos';

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

  const i = d.capitulos.findIndex((c) => c.slug === cap.slug);
  const anterior = d.capitulos[i - 1];
  const siguiente = d.capitulos[i + 1];

  const secciones = cap.apartados.map((a) => ({ slug: a.slug, titulo: a.titulo }));
  const terminos = terminosPorApartado();

  // Otros capítulos para «También te puede interesar».
  const otros = d.capitulos.filter((c) => c.slug !== cap.slug).slice(0, 4);

  return (
    <div className="lg:grid lg:grid-cols-[230px_1fr] lg:gap-12">
      {/* Columna lateral (solo escritorio) */}
      <div className="hidden lg:block">
        <div className="sticky top-24 flex flex-col gap-8">
          <RailCapitulo secciones={secciones} />

          {otros.length > 0 && (
            <nav aria-label="Otros capítulos">
              <p className="eyebrow mb-3">También te puede interesar</p>
              <ul className="flex flex-col">
                {otros.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/temario/${d.slug}/${c.slug}/`}
                      className="group flex items-center justify-between gap-2 border-t border-neutro-100 py-2 text-sm text-neutro-600 hover:text-rojo-600"
                    >
                      <span>{c.titulo}</span>
                      <span aria-hidden="true" className="text-neutro-300 group-hover:text-rojo-500">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </div>

      <article className="min-w-0">
        <nav className="mb-3 text-sm text-neutro-400">
          <Link href="/temario/" className="hover:text-rojo-600">
            Temario
          </Link>
          <span className="mx-2">›</span>
          <Link href={`/temario/${disciplina}/`} className="hover:text-rojo-600">
            {nombreDisciplina(disciplina)}
          </Link>
        </nav>

        <h1 className="text-3xl font-semibold tracking-tight text-neutro-950">
          {cap.titulo}
        </h1>

        {/* Índice desplegable (solo móvil) */}
        {secciones.length > 1 && (
          <details className="group mt-4 rounded-xl border border-neutro-200 lg:hidden">
            <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-neutro-700 marker:content-none">
              En este capítulo
              <span className="float-right text-neutro-400 transition group-open:rotate-180">
                ▾
              </span>
            </summary>
            <ul className="border-t border-neutro-100 px-4 py-2">
              {secciones.map((s) => (
                <li key={s.slug}>
                  <a
                    href={`#${s.slug}`}
                    className="block py-1.5 text-sm text-neutro-600 hover:text-rojo-600"
                  >
                    {s.titulo}
                  </a>
                </li>
              ))}
            </ul>
          </details>
        )}

        {cap.intro && (
          <div
            className="prose-ctrlz mt-5 text-neutro-700"
            dangerouslySetInnerHTML={{ __html: cap.intro }}
          />
        )}

        {cap.apartados.map((ap) => (
          <section
            key={ap.slug}
            id={ap.slug}
            className="mt-12 scroll-mt-24 border-t border-neutro-100 pt-8 first:border-0 first:pt-0"
          >
            <div className="prose-ctrlz" dangerouslySetInnerHTML={{ __html: ap.html }} />
            <TerminosApartado
              terminos={terminos.get(`${disciplina}/${capitulo}/${ap.slug}`) ?? []}
            />
          </section>
        ))}

        {/* Navegación anterior / siguiente */}
        <nav className="mt-14 grid grid-cols-2 gap-4 border-t border-neutro-200 pt-6">
          {anterior ? (
            <Link
              href={`/temario/${disciplina}/${anterior.slug}/`}
              className="group flex items-center gap-3 text-left"
            >
              <span aria-hidden="true" className="text-2xl text-neutro-300 transition group-hover:text-rojo-500">
                ←
              </span>
              <span className="min-w-0">
                <span className="eyebrow block">Anterior</span>
                <span className="block truncate font-medium text-neutro-900 group-hover:text-rojo-600">
                  {anterior.titulo}
                </span>
              </span>
            </Link>
          ) : (
            <span />
          )}
          {siguiente ? (
            <Link
              href={`/temario/${disciplina}/${siguiente.slug}/`}
              className="group flex items-center justify-end gap-3 text-right"
            >
              <span className="min-w-0">
                <span className="eyebrow block">Siguiente</span>
                <span className="block truncate font-medium text-neutro-900 group-hover:text-rojo-600">
                  {siguiente.titulo}
                </span>
              </span>
              <span aria-hidden="true" className="text-2xl text-neutro-300 transition group-hover:text-rojo-500">
                →
              </span>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </article>
    </div>
  );
}
