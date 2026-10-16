'use client';

import { useEffect, useRef, useState } from 'react';

/** Riel lateral de secciones: líneas finas; la activa más ancha y oscura;
 *  al pasar el ratón aparecen los títulos; al pulsar, desplaza al epígrafe. */
export default function RailCapitulo({
  secciones,
}: {
  secciones: { slug: string; titulo: string }[];
}) {
  const [activo, setActivo] = useState(secciones[0]?.slug ?? '');
  const visibles = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          visibles.current[e.target.id] = e.isIntersecting;
        });
        const primera = secciones.find((s) => visibles.current[s.slug]);
        if (primera) setActivo(primera.slug);
      },
      { rootMargin: '-15% 0px -75% 0px', threshold: 0 },
    );
    for (const s of secciones) {
      const el = document.getElementById(s.slug);
      if (el) obs.observe(el);
    }
    return () => obs.disconnect();
  }, [secciones]);

  function ir(e: React.MouseEvent, slug: string) {
    e.preventDefault();
    const el = document.getElementById(slug);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', `#${slug}`);
    }
  }

  return (
    <nav aria-label="Secciones del capítulo">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-black/40">
        En este capítulo
      </p>
      <ul className="flex flex-col gap-1">
        {secciones.map((s) => {
          const act = activo === s.slug;
          return (
            <li key={s.slug}>
              <a
                href={`#${s.slug}`}
                onClick={(e) => ir(e, s.slug)}
                aria-current={act ? 'true' : undefined}
                className="flex items-start gap-3 py-1"
              >
                <span
                  className={`mt-[0.5rem] block h-[2px] shrink-0 rounded-full transition-all duration-200 ${
                    act ? 'w-6 bg-tinta' : 'w-4 bg-black/25'
                  }`}
                />
                <span
                  className={`text-sm leading-snug transition-colors ${
                    act
                      ? 'text-tinta font-medium'
                      : 'text-black/55 hover:text-black/80'
                  }`}
                >
                  {s.titulo}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
