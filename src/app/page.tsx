import Link from 'next/link';
import CajaBusqueda from '@/components/CajaBusqueda';

const EJEMPLOS = [
  'espacio entre columnas',
  'líneas invisibles para ordenar una revista',
  'diferencia entre kerning y tracking',
  'partes de una noticia',
];

export default function Home() {
  return (
    <div className="flex flex-col items-center text-center gap-8 py-10">
      <div className="max-w-2xl">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          ¿Qué duda de diseño tienes?
        </h1>
        <p className="mt-3 text-black/60">
          Descríbela con tus palabras. CtrlZ te lleva al concepto correcto,
          aunque no recuerdes su nombre exacto.
        </p>
      </div>

      <div className="w-full max-w-xl">
        <CajaBusqueda autoFocus />
        <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm">
          {EJEMPLOS.map((e) => (
            <Link
              key={e}
              href={`/buscar/?q=${encodeURIComponent(e)}`}
              className="rounded-full border border-black/15 px-3 py-1 text-black/60 hover:border-acento hover:text-acento"
            >
              {e}
            </Link>
          ))}
        </div>
      </div>

      <p className="text-sm text-black/50">
        ¿Prefieres explorar?{' '}
        <Link href="/glosario" className="text-acento underline underline-offset-2">
          Ver el glosario completo
        </Link>
      </p>
    </div>
  );
}
