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
    <aside className="mt-8 rounded-xl border border-neutro-200 bg-neutro-50 p-5">
      <h3 className="eyebrow">Términos de este apartado</h3>
      <ul className="mt-3 flex flex-wrap gap-2">
        {terminos.map((t) => (
          <li key={t.id}>
            <Link
              href={`/glosario/${t.disciplina}/${t.id}/`}
              title={t.definicion}
              className="inline-block rounded-full border border-neutro-300 bg-white px-3 py-1 text-sm text-neutro-700 transition hover:border-rojo-500 hover:text-rojo-600"
            >
              {t.nombre}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
