import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'CtrlZ — resuelve tus dudas de diseño',
    template: '%s · CtrlZ',
  },
  description:
    'Plataforma de conocimiento de diseño. Escribe tu duda y encuentra el concepto correcto, aunque no recuerdes su nombre. Empezamos por Diseño Editorial.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col">
        <header className="border-b border-black/10">
          <div className="mx-auto max-w-4xl px-4 h-14 flex items-center justify-between">
            <Link href="/" className="font-semibold tracking-tight text-lg">
              Ctrl<span className="text-acento">Z</span>
            </Link>
            <nav className="flex gap-5 text-sm">
              <Link href="/buscar" className="hover:text-acento">Buscar</Link>
              <Link href="/temario" className="hover:text-acento">Temario</Link>
              <Link href="/diccionario" className="hover:text-acento">Glosario</Link>
            </nav>
          </div>
        </header>

        <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-10">{children}</main>

        <footer className="border-t border-black/10">
          <div className="mx-auto max-w-4xl px-4 py-6 text-sm text-black/50">
            CtrlZ · plataforma de conocimiento de diseño · MVP: Diseño Editorial
          </div>
        </footer>
      </body>
    </html>
  );
}
