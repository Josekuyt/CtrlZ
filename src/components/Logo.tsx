import Link from 'next/link';

/** Marca CtrlZ. `size` controla la escala; se usa en cabecera y en el héroe. */
export default function Logo({
  size = 'sm',
  asLink = true,
}: {
  size?: 'sm' | 'lg';
  asLink?: boolean;
}) {
  const clase =
    size === 'lg'
      ? 'text-4xl sm:text-5xl font-semibold tracking-tight'
      : 'text-lg font-semibold tracking-tight';

  const marca = (
    <span className={clase}>
      Ctrl<span className="text-acento">Z</span>
    </span>
  );

  if (!asLink) return marca;
  return (
    <Link href="/" aria-label="CtrlZ · inicio" className="inline-block">
      {marca}
    </Link>
  );
}
