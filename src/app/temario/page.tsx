import Link from 'next/link';
import type { Metadata } from 'next';
import { cargarTemario } from '@/lib/temario';

export const metadata: Metadata = {
  title: 'Temario',
  description: 'Temario navegable de diseño, por disciplinas.',
};

export default function TemarioIndex() {
  const disciplinas = cargarTemario();

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Temario</h1>
      <p className="mt-2 text-black/60">Elige una disciplina.</p>

      <div className="mt-8 flex flex-col gap-8">
        {disciplinas.map((d) => (
          <section key={d.slug}>
            <h2 className="text-xl font-medium">
              <Link href={`/temario/${d.slug}/`} className="hover:text-acento">
                {d.titulo}
              </Link>
            </h2>
            <ul className="mt-2 flex flex-col gap-1">
              {d.capitulos.map((cap) => (
                <li key={cap.slug}>
                  <Link
                    href={`/temario/${d.slug}/${cap.slug}/`}
                    className="hover:text-acento"
                  >
                    {cap.titulo}
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
