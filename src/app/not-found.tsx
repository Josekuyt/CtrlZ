import Link from 'next/link';
import CajaBusqueda from '@/components/CajaBusqueda';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center text-center gap-6 pt-10 sm:pt-20">
      <div className="flex flex-col items-center gap-2">
        <p className="text-5xl font-semibold tracking-tight text-black/80">404</p>
        <h1 className="text-xl font-medium">No encontramos esa página</h1>
        <p className="max-w-md text-black/60">
          Puede que el enlace haya cambiado. Prueba a buscar tu duda o explora el
          temario y el glosario.
        </p>
      </div>

      <div className="w-full max-w-xl">
        <CajaBusqueda globalHotkey />
      </div>

      <p className="text-sm text-black/50">
        Ir al{' '}
        <Link href="/temario" className="text-acento underline underline-offset-2">
          temario
        </Link>
        , al{' '}
        <Link href="/glosario" className="text-acento underline underline-offset-2">
          glosario
        </Link>{' '}
        o a la{' '}
        <Link href="/" className="text-acento underline underline-offset-2">
          página de inicio
        </Link>
        .
      </p>
    </div>
  );
}
