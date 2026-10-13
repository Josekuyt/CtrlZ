import Link from 'next/link';
import type { Metadata } from 'next';
import { obtenerTodos } from '@/lib/datos';

export const metadata: Metadata = {
  title: 'Diccionario',
  description: 'Todos los términos de diseño editorial, de la A a la Z.',
};

export default function DiccionarioPage() {
  const conceptos = obtenerTodos();

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Diccionario</h1>
      <p className="mt-2 text-black/60">
        {conceptos.length} términos, de la A a la Z.
      </p>

      <ul className="mt-8 flex flex-col divide-y divide-black/10">
        {conceptos.map((c) => (
          <li key={c.id} className="py-3">
            <Link href={`/${c.disciplina}/${c.id}/`} className="group block">
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-medium group-hover:text-acento">
                  {c.nombre}
                </span>
                <span className="shrink-0 text-xs uppercase tracking-wide text-black/40">
                  {c.categoria}
                </span>
              </div>
              <p className="text-sm text-black/60">{c.definicion}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
