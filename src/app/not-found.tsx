import Link from 'next/link';
import CajaBusqueda from '@/components/CajaBusqueda';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-6 pt-10 text-center sm:pt-20">
      <div className="flex flex-col items-center gap-2">
        <p className="font-mono text-5xl font-semibold tracking-tight text-rojo-500">404</p>
        <h1 className="text-xl font-medium text-neutro-900">No encontramos esa página</h1>
        <p className="max-w-md text-neutro-600">
          Puede que el enlace haya cambiado. Prueba a buscar tu duda o explora el
          temario y el glosario.
        </p>
      </div>

      <div className="w-full max-w-xl">
        <CajaBusqueda globalHotkey />
      </div>

      <p className="text-sm text-neutro-500">
        Ir al{' '}
        <Link href="/temario" className="text-rojo-600 underline underline-offset-2">
          temario
        </Link>
        , al{' '}
        <Link href="/glosario" className="text-rojo-600 underline underline-offset-2">
          glosario
        </Link>{' '}
        o a la{' '}
        <Link href="/" className="text-rojo-600 underline underline-offset-2">
          página de inicio
        </Link>
        .
      </p>
    </div>
  );
}
