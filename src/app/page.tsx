import Link from 'next/link';
import Logo from '@/components/Logo';
import CajaBusqueda from '@/components/CajaBusqueda';

// Sugerencias que enseñan qué tipo de preguntas admite el buscador.
const SUGERENCIAS = [
  'Cómo se llama el espaciado entre columnas',
  'Para qué sirve una retícula',
  'Qué diferencia hay entre kerning y tracking',
];

export default function Home() {
  return (
    <div className="flex flex-col items-center text-center gap-8 pt-10 sm:pt-20">
      <div className="flex flex-col items-center gap-3">
        <Logo size="lg" asLink={false} />
        <p className="max-w-xl text-black/60">
          Resuelve tus dudas de diseño. Describe lo que no recuerdas y te llevamos
          al concepto correcto, aunque no sepas su nombre exacto.
        </p>
      </div>

      <div className="w-full max-w-xl">
        <CajaBusqueda autoFocus globalHotkey />

        <div className="mt-5">
          <p className="text-xs uppercase tracking-wide text-black/40 mb-2">
            Prueba a preguntar
          </p>
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:justify-center gap-2">
            {SUGERENCIAS.map((s) => (
              <Link
                key={s}
                href={`/buscar/?q=${encodeURIComponent(s)}`}
                className="rounded-full border border-black/15 px-4 py-2 text-sm text-black/70 hover:border-acento hover:text-acento"
              >
                {s}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <p className="text-sm text-black/50">
        O explora el{' '}
        <Link href="/temario" className="text-acento underline underline-offset-2">
          temario
        </Link>{' '}
        y el{' '}
        <Link href="/glosario" className="text-acento underline underline-offset-2">
          glosario
        </Link>
        .
      </p>
    </div>
  );
}
