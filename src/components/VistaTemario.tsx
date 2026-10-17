import Link from 'next/link';
import { cargarTemario, obtenerDisciplina } from '@/lib/temario';

/** Índice del temario: título + descripción + chips de disciplina + grid de capítulos. */
export default function VistaTemario({
  disciplinaActiva,
}: {
  disciplinaActiva: string;
}) {
  const disciplinas = cargarTemario();
  const activa = obtenerDisciplina(disciplinaActiva) ?? disciplinas[0];

  return (
    <div>
      <h1 className="text-4xl font-semibold tracking-tight text-neutro-950">Temario</h1>
      <p className="mt-2 text-lg text-neutro-500">
        Elige una disciplina y explora sus capítulos.
      </p>

      {/* Chips de disciplina */}
      <div className="mt-6 flex flex-wrap gap-2">
        {disciplinas.map((d) => (
          <Link
            key={d.slug}
            href={`/temario/${d.slug}/`}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              d.slug === activa?.slug
                ? 'border-rojo-500 bg-rojo-50 text-rojo-600'
                : 'border-neutro-300 text-neutro-600 hover:border-rojo-400 hover:text-rojo-600'
            }`}
          >
            {d.titulo}
          </Link>
        ))}
      </div>

      {/* Grid de capítulos */}
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {activa?.capitulos.map((cap, idx) => (
          <Link
            key={cap.slug}
            href={`/temario/${activa.slug}/${cap.slug}/`}
            className="group flex flex-col rounded-xl border border-neutro-200 bg-white p-6 transition hover:border-neutro-300 hover:shadow-sm"
          >
            <span className="font-mono text-sm text-neutro-400">
              {String(idx + 1).padStart(2, '0')}
            </span>
            <h2 className="mt-2 text-lg font-semibold leading-snug text-neutro-950 group-hover:text-rojo-600">
              {cap.titulo}
            </h2>
            {cap.descripcion && (
              <p className="mt-2 flex-1 text-sm leading-relaxed text-neutro-600">
                {cap.descripcion}
              </p>
            )}
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-rojo-600">
              Ver capítulo <span aria-hidden="true">→</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
