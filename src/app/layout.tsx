import type { Metadata } from 'next';
import Link from 'next/link';
import Logo from '@/components/Logo';
import BuscadorCabecera from '@/components/BuscadorCabecera';
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
          <div className="mx-auto max-w-4xl px-4 h-14 flex items-center justify-between gap-4">
            <div className="flex items-center gap-5">
              <Logo />
              <Link
                href="/sobre"
                className="text-sm text-black/60 hover:text-acento"
              >
                Sobre CtrlZ
              </Link>
            </div>
            <nav className="flex items-center gap-5 text-sm">
              <BuscadorCabecera />
              <Link href="/temario" className="hover:text-acento">Temario</Link>
              <Link href="/glosario" className="hover:text-acento">Glosario</Link>
            </nav>
          </div>
        </header>

        <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-10">{children}</main>

        <footer className="border-t border-black/10">
          <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-2 px-4 py-6 text-sm text-black/50">
            <span>CtrlZ · plataforma de conocimiento de diseño · MVP: Diseño Editorial</span>
            <a
              href="https://github.com/Josekuyt/CtrlZ/issues/new?title=Sugerencia&body=Cu%C3%A9ntanos%20qu%C3%A9%20t%C3%A9rmino%20falta%20o%20qu%C3%A9%20mejorar%C3%ADas%3A%0A%0A"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-acento"
            >
              Sugerir un término o mejora
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
