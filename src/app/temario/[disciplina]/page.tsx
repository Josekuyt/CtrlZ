import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cargarTemario, obtenerDisciplina } from '@/lib/temario';

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
  const d = obtenerDisciplina(disciplina);
  return d ? { title: `Temario · ${d.titulo}` } : {};
}

export default async function DisciplinaPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { disciplina } = await params;
  const d = obtenerDisciplina(disciplina);
  if (!d) notFound();

  return (
    <div>
      <nav className="text-sm text-black/40 mb-2">
        <Link href="/temario/" className="hover:text-acento">
          Temario
        </Link>
      </nav>
      <h1 className="text-3xl font-semibold tracking-tight">{d.titulo}</h1>
      <p className="mt-2 text-black/60">{d.capitulos.length} capítulos.</p>

      <div className="mt-8 flex flex-col gap-6">
        {d.capitulos.map((cap) => (
          <section key={cap.slug}>
            <h2 className="text-lg font-medium">
              <Link
                href={`/temario/${d.slug}/${cap.slug}/`}
                className="hover:text-acento"
              >
                {cap.titulo}
              </Link>
            </h2>
            {cap.descripcion && <p className="text-black/60">{cap.descripcion}</p>}
          </section>
        ))}
      </div>
    </div>
  );
}
