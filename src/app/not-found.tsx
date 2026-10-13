import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-3xl font-semibold">Ctrl+Z</h1>
      <p className="mt-3 text-black/60">
        Esta página no existe (todavía). Deshagamos el paso en falso.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-lg bg-acento px-5 py-3 text-white font-medium hover:opacity-90"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
