import Link from 'next/link';
import type { Metadata } from 'next';
import CajaBusqueda from '@/components/CajaBusqueda';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

// Preguntas de ejemplo que enseñan qué admite el buscador.
const SUGERENCIAS = [
  'Cómo se llama el espacio entre columnas',
  'Para qué sirve una retícula',
  'Qué diferencia hay entre kerning y tracking',
];

// Disciplinas del mapa de CtrlZ. Editorial y Tipografía ya están disponibles;
// el resto se muestran como «próximamente».
type Disciplina = { slug: string; label: string; img: string; href?: string };
const DISCIPLINAS: Disciplina[] = [
  { slug: 'editorial', label: 'Diseño editorial', img: '/disciplinas/editorial.png', href: '/temario/editorial/' },
  { slug: 'tipografia', label: 'Tipografía', img: '/disciplinas/tipografia.png', href: '/temario/tipografia/' },
  { slug: 'composicion', label: 'Composición', img: '/disciplinas/composicion.png' },
  { slug: 'color', label: 'Color', img: '/disciplinas/color.png' },
  { slug: 'senaletica', label: 'Señalética', img: '/disciplinas/senaletica.png' },
  { slug: 'interactivo', label: 'Diseño interactivo', img: '/disciplinas/interactivo.png' },
  { slug: 'lenguaje-visual', label: 'Lenguaje visual', img: '/disciplinas/lenguaje-visual.png' },
];

function TarjetaDisciplina({ d }: { d: Disciplina }) {
  const imagen = (
    <div
      className="relative aspect-square overflow-hidden"
      style={{ backgroundColor: '#e9e2d8' }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={d.img}
        alt=""
        width={256}
        height={282}
        loading="lazy"
        className={
          d.href
            ? 'h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]'
            : 'h-full w-full object-cover opacity-45 grayscale'
        }
      />
      {!d.href && (
        <span className="absolute left-3 top-3 rounded-full bg-neutro-900/80 px-2.5 py-1 text-[11px] font-medium text-white">
          Próximamente
        </span>
      )}
    </div>
  );

  if (d.href) {
    return (
      <Link
        href={d.href}
        className="group flex flex-col overflow-hidden rounded-xl border border-neutro-200 bg-white transition hover:border-rojo-400 hover:shadow-sm"
      >
        {imagen}
        <div className="flex items-center justify-between gap-2 px-4 py-3">
          <span className="font-medium text-neutro-900 group-hover:text-rojo-600">{d.label}</span>
          <span aria-hidden="true" className="text-neutro-300 transition group-hover:text-rojo-500">
            →
          </span>
        </div>
      </Link>
    );
  }

  return (
    <div
      aria-disabled="true"
      className="flex flex-col overflow-hidden rounded-xl border border-neutro-200 bg-white"
    >
      {imagen}
      <div className="px-4 py-3">
        <span className="font-medium text-neutro-400">{d.label}</span>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <h1 className="sr-only">CtrlZ — resuelve tus dudas de diseño</h1>

      {/* Héroe: el buscador es el centro de la página */}
      <section className="w-full max-w-2xl pt-8 text-center sm:pt-14">
        <CajaBusqueda autoFocus globalHotkey />

        <div className="mt-6">
          <p className="eyebrow mb-3">Prueba a preguntar</p>
          <div className="flex flex-wrap justify-center gap-2">
            {SUGERENCIAS.map((s) => (
              <Link
                key={s}
                href={`/buscar/?q=${encodeURIComponent(s)}`}
                className="rounded-lg border border-neutro-200 px-4 py-2 text-sm text-neutro-700 transition hover:border-rojo-500 hover:text-rojo-600"
              >
                {s}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Disciplinas */}
      <section className="mt-16 w-full sm:mt-24">
        <div className="mb-5 flex items-end justify-between gap-4">
          <p className="eyebrow">Explora por disciplina</p>
          <p className="text-sm text-neutro-500">Editorial y Tipografía disponibles; el resto, en camino.</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {DISCIPLINAS.map((d) => (
            <TarjetaDisciplina key={d.slug} d={d} />
          ))}
        </div>
      </section>
    </div>
  );
}
