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
    <nav aria-label="Secciones del capítulo" className="group">
      <ul className="flex flex-col gap-2">
        {secciones.map((s) => {
          const act = activo === s.slug;
          return (
            <li key={s.slug}>
              <a
                href={`#${s.slug}`}
                onClick={(e) => ir(e, s.slug)}
                aria-current={act ? 'true' : undefined}
                className="flex items-center gap-3 py-1"
              >
                <span
                  className={`h-[3px] rounded-full transition-all duration-200 ${
                    act
                      ? 'w-8 bg-tinta'
                      : 'w-5 bg-black/20 group-hover:bg-black/35'
                  }`}
                />
                <span
                  className={`whitespace-nowrap text-sm opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 ${
                    act ? 'text-tinta font-medium' : 'text-black/55'
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
