import Link from 'next/link';
import type { Concepto } from '@/lib/schema';
import Relaciones from '@/components/Relaciones';

export default function FichaConcepto({
  concepto,
  grafo,
}: {
  concepto: Concepto;
  grafo: Map<string, Concepto>;
}) {
  return (
    <article>
      <nav className="text-sm text-black/40 mb-4">
        <Link href="/glosario/" className="hover:text-acento">
          Glosario
        </Link>
        <span className="mx-2">›</span>
        <Link
          href={`/glosario/${concepto.disciplina}/`}
          className="hover:text-acento capitalize"
        >
          {concepto.disciplina}
        </Link>
        <span className="mx-2">›</span>
        <span className="capitalize">{concepto.categoria}</span>
      </nav>

      <h1 className="text-3xl font-semibold tracking-tight">{concepto.nombre}</h1>

      {concepto.sinonimos.length > 0 && (
        <p className="mt-1 text-sm text-black/50">
          También: {concepto.sinonimos.join(', ')}
        </p>
      )}

      <p className="mt-4 text-lg">{concepto.definicion}</p>

      {concepto.temario && (
        <p className="mt-3">
          <Link
            href={concepto.temario}
            className="inline-flex items-center gap-1 text-acento font-medium hover:underline"
          >
            Explicado en el temario →
          </Link>
        </p>
      )}

      {concepto.explicacion && (
        <div className="mt-4 whitespace-pre-line leading-relaxed text-black/80">
          {concepto.explicacion}
        </div>
      )}

      {concepto.ejemplos.length > 0 && (
        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-black/40">
            Ejemplos
          </h2>
          <ul className="mt-2 list-disc pl-5 text-black/80">
            {concepto.ejemplos.map((ej, i) => (
              <li key={i}>{ej}</li>
            ))}
          </ul>
        </section>
      )}

      <Relaciones concepto={concepto} grafo={grafo} />

      {concepto.referencias.length > 0 && (
        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-black/40">
            Referencias
          </h2>
          <ul className="mt-2 text-sm text-black/60">
            {concepto.referencias.map((r, i) => (
              <li key={i}>
                {r.url ? (
                  <a href={r.url} className="underline" target="_blank" rel="noreferrer">
                    {r.titulo}
                  </a>
                ) : (
                  r.titulo
                )}
                {r.autor ? ` — ${r.autor}` : ''}
                {r.anio ? ` (${r.anio})` : ''}
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
