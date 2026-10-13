/** @type {import('next').NextConfig} */
const nextConfig = {
  // Exportación estática: Next genera HTML en /out, listo para Netlify sin servidor.
  output: 'export',
  // Sin optimización de imágenes en servidor (no hay servidor en producción).
  images: { unoptimized: true },
  // Rutas con barra final: encaja mejor con hosting estático.
  trailingSlash: true,
};

export default nextConfig;
