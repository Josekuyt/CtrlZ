import Link from 'next/link';
import { marked } from 'marked';
import type { Concepto } from '@/lib/schema';
import { nombreDisciplina } from '@/lib/temario';
import { etiquetaCategoria } from '@/lib/etiquetas';
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

  const hayLateral = concepto.relaciones.length > 0 || concepto.referencias.length > 0;

  const lateral = hayLateral && (
    <aside className="mb-8 lg:mb-0">
      <div className="flex flex-col gap-8 lg:sticky lg:top-24">
        <Relaciones concepto={concepto} grafo={grafo} />

        {concepto.referencias.length > 0 && (
          <section>
            <p className="eyebrow mb-3">También te puede interesar</p>
            <ul className="flex flex-col">
              {concepto.referencias.map((r, i) => {
                const contenido = (
                  <span className="min-w-0">
                    <span className="block text-sm text-neutro-800">{r.titulo}</span>
                    {(r.autor || r.anio) && (
                      <span className="block text-xs text-neutro-500">
                        {r.autor}
                        {r.autor && r.anio ? ' · ' : ''}
                        {r.anio ?? ''}
                      </span>
                    )}
                  </span>
                );
                return (
                  <li key={i} className="border-t border-neutro-100 py-2 first:border-0">
                    {r.url ? (
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-center justify-between gap-2 hover:text-rojo-600"
                      >
                        {contenido}
                        <span aria-hidden="true" className="text-neutro-300 group-hover:text-rojo-500">
                          →
                        </span>
                      </a>
                    ) : (
                      contenido
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>
    </aside>
  );

  const contenido = (
    <article className="min-w-0">
      <nav className="mb-4 text-sm text-neutro-400">
        <Link href="/glosario/" className="hover:text-rojo-600">
          Glosario
        </Link>
        <span className="mx-2">›</span>
        <Link href={`/glosario/${concepto.disciplina}/`} className="hover:text-rojo-600">
          {nombreDisciplina(concepto.disciplina)}
        </Link>
        <span className="mx-2">›</span>
        <Link
          href={`/glosario/${concepto.disciplina}/#${concepto.categoria}`}
          className="hover:text-rojo-600"
        >
          {etiquetaCategoria(concepto.categoria)}
        </Link>
      </nav>

      <h1 className="text-4xl font-semibold tracking-tight text-neutro-950">
        {concepto.nombre}
      </h1>

      {concepto.sinonimos.length > 0 && (
        <p className="mt-1.5 text-sm text-neutro-500">
          También: {concepto.sinonimos.join(', ')}
        </p>
      )}

      <p className="mt-5 text-lg leading-relaxed text-neutro-800">{concepto.definicion}</p>

      {concepto.explicacion && (
        <div
          className="prose-ctrlz mt-4"
          dangerouslySetInnerHTML={{ __html: marked.parse(concepto.explicacion) as string }}
        />
      )}

      {concepto.temario && (
        <div className="mt-6 rounded-xl border border-neutro-200 bg-neutro-50 p-4">
          <p className="eyebrow mb-2">Dónde se explica</p>
          <Link
            href={concepto.temario}
            className="inline-flex items-center gap-1 font-medium text-rojo-600 hover:underline"
          >
            {nombreDisciplina(concepto.disciplina)} · {etiquetaCategoria(concepto.categoria)}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}

      {concepto.ejemplos.length > 0 && (
        <section className="mt-8">
          <p className="eyebrow mb-2">Ejemplos</p>
          <ul className="list-disc pl-5 text-neutro-800">
            {concepto.ejemplos.map((ej, i) => (
              <li key={i} className="my-1 leading-relaxed">
                {ej}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Navegación anterior / siguiente (orden alfabético del glosario) */}
      {(anterior || siguiente) && (
        <nav className="mt-12 grid grid-cols-2 gap-4 border-t border-neutro-200 pt-6">
          {anterior ? (
            <Link
              href={`/glosario/${anterior.disciplina}/${anterior.id}/`}
              className="group flex items-center gap-3 text-left"
            >
              <span aria-hidden="true" className="text-2xl text-neutro-300 transition group-hover:text-rojo-500">
                ←
              </span>
              <span className="min-w-0">
                <span className="eyebrow block">Término anterior</span>
                <span className="block truncate font-medium text-neutro-900 group-hover:text-rojo-600">
                  {anterior.nombre}
                </span>
              </span>
            </Link>
          ) : (
            <span />
          )}
          {siguiente ? (
            <Link
              href={`/glosario/${siguiente.disciplina}/${siguiente.id}/`}
              className="group flex items-center justify-end gap-3 text-right"
            >
              <span className="min-w-0">
                <span className="eyebrow block">Término siguiente</span>
                <span className="block truncate font-medium text-neutro-900 group-hover:text-rojo-600">
                  {siguiente.nombre}
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
      )}

      <p className="mt-8 text-sm text-neutro-400">
        ¿Ves una errata o falta algo?{' '}
        <a href={sugerirUrl} target="_blank" rel="noreferrer" className="underline hover:text-rojo-600">
          Sugerir una mejora
        </a>
      </p>
    </article>
  );

  if (!hayLateral) return contenido;
  return (
    <div className="lg:grid lg:grid-cols-[230px_1fr] lg:gap-12">
      {lateral}
      {contenido}
    </div>
  );
}
