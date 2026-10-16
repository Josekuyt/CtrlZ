import Link from 'next/link';
import { marked } from 'marked';
import type { Concepto } from '@/lib/schema';
import { nombreDisciplina } from '@/lib/temario';
import { etiquetaCategoria, etiquetaNivel } from '@/lib/etiquetas';
import Relaciones from '@/components/Relaciones';

type Vecino = { id: string; nombre: string; disciplina: string };

const REPO = 'https://github.com/Josekuyt/CtrlZ';

export default function FichaConcepto({
  concepto,
  grafo,
  anterior,
  siguiente,
}: {
  concepto: Concepto;
  grafo: Map<string, Concepto>;
  anterior?: Vecino;
  siguiente?: Vecino;
}) {
  const sugerirUrl =
    `${REPO}/issues/new?title=` +
    encodeURIComponent(`Mejora en el término: ${concepto.nombre}`) +
    '&body=' +
    encodeURIComponent(
      `Término: ${concepto.nombre}\nURL: /glosario/${concepto.disciplina}/${concepto.id}/\n\nSugerencia:\n`,
    );

  return (
    <article>
      <nav className="text-sm text-black/40 mb-4">
        <Link href="/glosario/" className="hover:text-acento">
          Glosario
        </Link>
        <span className="mx-2">›</span>
        <Link
          href={`/glosario/${concepto.disciplina}/`}
          className="hover:text-acento"
        >
          {nombreDisciplina(concepto.disciplina)}
        </Link>
        <span className="mx-2">›</span>
        <Link
          href={`/glosario/${concepto.disciplina}/#${concepto.categoria}`}
          className="hover:text-acento"
        >
          {etiquetaCategoria(concepto.categoria)}
        </Link>
      </nav>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">{concepto.nombre}</h1>
        <span className="rounded-full border border-black/15 px-2.5 py-0.5 text-xs text-black/50">
          {etiquetaNivel(concepto.nivel)}
        </span>
      </div>

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
        <div
          className="prose-ctrlz mt-4"
          dangerouslySetInnerHTML={{ __html: marked.parse(concepto.explicacion) as string }}
        />
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

      {/* Navegación anterior / siguiente dentro del glosario (orden alfabético) */}
      {(anterior || siguiente) && (
        <div className="mt-10 flex justify-between gap-4 border-t border-black/10 pt-4 text-sm">
          {anterior ? (
            <Link
              href={`/glosario/${anterior.disciplina}/${anterior.id}/`}
              className="text-acento hover:underline"
            >
              ← {anterior.nombre}
            </Link>
          ) : (
            <span />
          )}
          {siguiente ? (
            <Link
              href={`/glosario/${siguiente.disciplina}/${siguiente.id}/`}
              className="text-acento hover:underline text-right"
            >
              {siguiente.nombre} →
            </Link>
          ) : (
            <span />
          )}
        </div>
      )}

      <p className="mt-6 text-sm text-black/40">
        ¿Ves una errata o falta algo?{' '}
        <a
          href={sugerirUrl}
          target="_blank"
          rel="noreferrer"
          className="underline hover:text-acento"
        >
          Sugerir una mejora
        </a>
      </p>
    </article>
  );
}
