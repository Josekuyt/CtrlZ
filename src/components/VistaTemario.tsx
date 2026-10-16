import Link from 'next/link';
import { cargarTemario, obtenerDisciplina } from '@/lib/temario';

/** Chips de disciplina + grid de capítulos (con ligero escalonado). */
export default function VistaTemario({
  disciplinaActiva,
}: {
  disciplinaActiva: string;
}) {
  const disciplinas = cargarTemario();
  const activa = obtenerDisciplina(disciplinaActiva) ?? disciplinas[0];

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Temario</h1>
      <p className="mt-2 text-black/60">
        Elige una disciplina y entra en un capítulo.
      </p>

      {/* Chips de disciplina */}
      <div className="mt-6 flex flex-wrap gap-2">
        {disciplinas.map((d) => (
          <Link
            key={d.slug}
            href={`/temario/${d.slug}/`}
            className={`rounded-full border px-4 py-1.5 text-sm ${
              d.slug === activa?.slug
                ? 'border-acento bg-acento/10 text-acento'
                : 'border-black/15 text-black/60 hover:border-acento'
            }`}
          >
            {d.titulo}
          </Link>
        ))}
      </div>

      {/* Grid de capítulos, escalonado */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {activa?.capitulos.map((cap, idx) => (
          <Link
            key={cap.slug}
            href={`/temario/${activa.slug}/${cap.slug}/`}
            className={`group block rounded-xl border border-black/10 p-5 transition hover:border-acento hover:shadow-sm ${
              idx % 2 === 1 ? 'sm:mt-6' : ''
            }`}
          >
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-lg font-medium group-hover:text-acento">
                {cap.titulo}
              </h2>
              <span className="shrink-0 text-xs text-black/40">
                {cap.apartados.length} apartados
              </span>
            </div>
            {cap.descripcion && (
              <p className="mt-1 text-sm text-black/60">{cap.descripcion}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
