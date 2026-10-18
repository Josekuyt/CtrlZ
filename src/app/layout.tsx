import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import JsonLd from '@/components/JsonLd';
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/site';
import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/500.css';
import '@fontsource/ibm-plex-sans/600.css';
import '@fontsource/ibm-plex-sans/700.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'CtrlZ — resuelve tus dudas de diseño',
    template: '%s · CtrlZ',
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'es_ES',
    url: SITE_URL,
    title: 'CtrlZ — resuelve tus dudas de diseño',
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CtrlZ — resuelve tus dudas de diseño',
    description: SITE_DESCRIPTION,
  },
};

const SUGERENCIA_URL =
  'https://github.com/Josekuyt/CtrlZ/issues/new?title=Sugerencia&body=Cu%C3%A9ntanos%20qu%C3%A9%20t%C3%A9rmino%20falta%20o%20qu%C3%A9%20mejorar%C3%ADas%3A%0A%0A';

const WEBSITE_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  description: SITE_DESCRIPTION,
  inLanguage: 'es',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/buscar/?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="flex min-h-screen flex-col bg-white font-sans text-neutro-900">
        <JsonLd data={WEBSITE_LD} />

        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-neutro-900 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
        >
          Saltar al contenido
        </a>

        <Header />

        <main
          id="contenido"
          className="mx-auto w-full max-w-6xl flex-1 px-6 py-10 sm:py-12"
        >
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
                className="hover:text-rojo-600"
              >
                Sugerir una mejora
              </a>
              <Link href="/sobre" className="hover:text-rojo-600">
                Sobre CtrlZ
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
