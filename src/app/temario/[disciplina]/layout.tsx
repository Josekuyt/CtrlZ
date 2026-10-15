import MenuLateral from '@/components/MenuLateral';
import { arbolTemario, cargarTemario } from '@/lib/temario';

export function generateStaticParams() {
  return cargarTemario().map((d) => ({ disciplina: d.slug }));
}

export default async function TemarioDisciplinaLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ disciplina: string }>;
}) {
  const { disciplina } = await params;
  const arbol = arbolTemario(disciplina);

  return (
    <div className="grid gap-8 md:grid-cols-[220px_1fr]">
      <MenuLateral disciplina={disciplina} arbol={arbol} />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
