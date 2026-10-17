import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/500.css';
import '@fontsource/ibm-plex-sans/600.css';
import '@fontsource/ibm-plex-sans/700.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'CtrlZ — resuelve tus dudas de diseño',
    template: '%s · CtrlZ',
  },
  description:
    'CtrlZ — consulta y aprendizaje de diseño gráfico. Escribe tu duda y encuentra el concepto correcto, aunque no recuerdes su nombre. Empezamos por Diseño Editorial.',
};

const SUGERENCIA_URL =
  'https://github.com/Josekuyt/CtrlZ/issues/new?title=Sugerencia&body=Cu%C3%A9ntanos%20qu%C3%A9%20t%C3%A9rmino%20falta%20o%20qu%C3%A9%20mejorar%C3%ADas%3A%0A%0A';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="flex min-h-screen flex-col bg-white font-sans text-neutro-900">
        <Header />

        <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10 sm:py-12">
          {children}
        </main>

        <footer className="border-t border-neutro-200">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-6 text-sm text-neutro-500">
            <span>CtrlZ — consulta y aprendizaje de diseño gráfico</span>
            <div className="flex items-center gap-6">
              <a
                href={SUGERENCIA_URL}
                target="_blank"
                rel="noreferrer"
                className="hover:text-rojo-500"
              >
                Sugerir una mejora
              </a>
              <Link href="/sobre" className="hover:text-rojo-500">
                Sobre CtrlZ
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
