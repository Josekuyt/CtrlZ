import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { cargarTemario } from '@/lib/temario';
import { obtenerGrafo, obtenerDisciplinas } from '@/lib/datos';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const u = (p: string) => `${SITE_URL}${p}`;

  const rutas: MetadataRoute.Sitemap = [
    { url: u('/'), lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: u('/temario/'), lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: u('/glosario/'), lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: u('/grafo/'), lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: u('/sobre/'), lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
  ];

  // Temario: disciplinas, capítulos
  for (const d of cargarTemario()) {
    rutas.push({
      url: u(`/temario/${d.slug}/`),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    });
    for (const cap of d.capitulos) {
      rutas.push({
        url: u(`/temario/${d.slug}/${cap.slug}/`),
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }

  // Glosario: índices por disciplina y fichas de término
  for (const disc of obtenerDisciplinas()) {
    rutas.push({
      url: u(`/glosario/${disc}/`),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.5,
    });
  }
  for (const c of obtenerGrafo().values()) {
    rutas.push({
      url: u(`/glosario/${c.disciplina}/${c.id}/`),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  }

  return rutas;
}
