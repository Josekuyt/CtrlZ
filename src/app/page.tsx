import Link from 'next/link';
import CajaBusqueda from '@/components/CajaBusqueda';

// Preguntas de ejemplo que enseñan qué admite el buscador.
const SUGERENCIAS = [
  'Cómo se llama el espacio entre columnas',
  'Para qué sirve una retícula',
  'Qué diferencia hay entre kerning y tracking',
];

// Disciplinas del mapa de CtrlZ. Solo Diseño editorial está disponible (MVP).
const DISCIPLINAS: { label: string; href?: string }[] = [
  { label: 'Diseño editorial', href: '/temario/editorial/' },
  { label: 'Tipografía' },
  { label: 'Composición' },
  { label: 'Color' },
  { label: 'Identidad visual' },
  { label: 'Motion graphics' },
  { label: 'Diseño interactivo' },
  { label: 'Fotografía' },
  { label: 'Señalética' },
  { label: 'Lenguaje visual' },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <h1 className="sr-only">CtrlZ — resuelve tus dudas de diseño</h1>

      {/* Héroe: el buscador es el centro de la página */}
      <section className="w-full max-w-2xl pt-8 text-center sm:pt-16">
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

      {/* Disciplinas: breadth del proyecto; de momento solo editorial */}
      <section className="mt-16 w-full max-w-3xl sm:mt-24">
        <p className="eyebrow mb-4 text-center">Explora por disciplina</p>
        <div className="flex flex-wrap justify-center gap-2">
          {DISCIPLINAS.map((d) =>
            d.href ? (
              <Link
                key={d.label}
                href={d.href}
                className="rounded-full border border-neutro-300 px-4 py-1.5 text-sm font-medium text-neutro-900 transition hover:border-rojo-500 hover:text-rojo-600"
              >
                {d.label}
              </Link>
            ) : (
              <span
                key={d.label}
                title="Próximamente"
                className="rounded-full border border-neutro-200 px-4 py-1.5 text-sm text-neutro-400"
              >
                {d.label}
              </span>
            ),
          )}
        </div>
        <p className="mt-4 text-center text-sm text-neutro-500">
          Empezamos por Diseño editorial; el resto llegará poco a poco.
        </p>
      </section>
    </div>
  );
}
