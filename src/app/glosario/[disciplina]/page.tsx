import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { obtenerGrafo, obtenerDisciplinas } from '@/lib/datos';
import { nombreDisciplina } from '@/lib/temario';
import { etiquetaCategoria } from '@/lib/etiquetas';
import type { Concepto } from '@/lib/schema';

type Params = { disciplina: string };

export function generateStaticParams(): Params[] {
  return obtenerDisciplinas().map((disciplina) => ({ disciplina }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { disciplina } = await params;
  return { title: `Glosario · ${nombreDisciplina(disciplina)}` };
}

export default async function GlosarioDisciplinaPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { disciplina } = await params;
  const conceptos = [...obtenerGrafo().values()].filter(
    (c) => c.disciplina === disciplina,
  );
  if (conceptos.length === 0) notFound();

  const porCategoria = new Map<string, Concepto[]>();
  for (const c of conceptos) {
    const lista = porCategoria.get(c.categoria) ?? [];
    lista.push(c);
    porCategoria.set(c.categoria, lista);
  }

  return (
    <div>
      <nav className="mb-2 text-sm text-neutro-400">
        <Link href="/glosario/" className="hover:text-rojo-600">
          Glosario
        </Link>
      </nav>
      <h1 className="text-4xl font-semibold tracking-tight text-neutro-950">
        {nombreDisciplina(disciplina)}
      </h1>
      <p className="mt-2 text-neutro-500">{conceptos.length} términos.</p>

      <div className="mt-8 flex flex-col gap-8">
        {[...porCategoria.entries()]
          .sort((a, b) => a[0].localeCompare(b[0], 'es'))
          .map(([categoria, lista]) => (
            <section key={categoria} id={categoria} className="scroll-mt-24">
              <h2 className="eyebrow">{etiquetaCategoria(categoria)}</h2>
              <ul className="mt-2 flex flex-col gap-1">
                {lista
                  .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
                  .map((c) => (
                    <li key={c.id}>
                      <Link
                        href={`/glosario/${c.disciplina}/${c.id}/`}
                        className="text-neutro-700 hover:text-rojo-600"
                      >
                        {c.nombre}
                      </Link>
                    </li>
                  ))}
              </ul>
            </section>
          ))}
      </div>
    </div>
  );
}
