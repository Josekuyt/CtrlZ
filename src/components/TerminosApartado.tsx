import Link from 'next/link';
import type { TerminoApartado } from '@/lib/datos';

/**
 * Caja "Términos de este apartado": lista los términos del glosario
 * que remiten a este apartado (vía su backlink `temario:`).
 * Si no hay términos, no renderiza nada.
 */
export default function TerminosApartado({
  terminos,
}: {
  terminos: TerminoApartado[];
}) {
  if (terminos.length === 0) return null;

  return (
    <aside className="mt-8 rounded-xl border border-black/10 bg-black/[0.02] p-5">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-black/40">
        Términos de este apartado
      </h3>
      <ul className="mt-3 flex flex-wrap gap-2">
        {terminos.map((t) => (
          <li key={t.id}>
            <Link
              href={`/glosario/${t.disciplina}/${t.id}/`}
              title={t.definicion}
              className="inline-block rounded-full border border-black/15 bg-white px-3 py-1 text-sm text-black/70 transition hover:border-acento hover:text-acento"
            >
              {t.nombre}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
