/**
 * Datos del sitio para SEO (metadata, canónicos, sitemap, JSON-LD).
 * El dominio de producción se define en la variable de entorno
 * NEXT_PUBLIC_SITE_URL (Netlify → Site settings → Environment, o netlify.toml).
 * Mientras no se defina, se usa el placeholder de abajo.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://controlz-design.netlify.app'
).replace(/\/$/, '');

export const SITE_NAME = 'CtrlZ';

export const SITE_DESCRIPTION =
  'CtrlZ — consulta y aprendizaje de diseño gráfico. Escribe tu duda y encuentra el concepto correcto, aunque no recuerdes su nombre. Empezamos por Diseño Editorial.';

/** URL absoluta a partir de una ruta interna (siempre con barra final). */
export function urlAbs(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${p}`;
}
