import type { Metadata } from 'next';
import Link from 'next/link';
import { cargarTemario, nombreDisciplina } from '@/lib/temario';
import { obtenerTodos } from '@/lib/datos';
import GrafoConocimiento, {
  type CapituloNodo,
} from '@/components/GrafoConocimiento';

export const metadata: Metadata = {
  title: 'Mapa',
  description:
    'Mapa de conocimiento: los capítulos del temario y sus términos de glosario, de un vistazo.',
};

const DISCIPLINA = 'editorial';

export default function GrafoPage() {
  const temario = cargarTemario().find((d) => d.slug === DISCIPLINA);

  // Términos del glosario agrupados por capítulo (vía su backlink `temario:`).
  const porCapitulo = new Map<string, { id: string; nombre: string; url: string }[]>();
  const re = /^\/temario\/([^/]+)\/([^/]+)\//;
  for (const c of obtenerTodos()) {
    if (!c.temario) continue;
    const m = re.exec(c.temario);
    if (!m || m[1] !== DISCIPLINA) continue;
    const lista = porCapitulo.get(m[2]) ?? [];
    lista.push({ id: c.id, nombre: c.nombre, url: `/glosario/${c.disciplina}/${c.id}/` });
    porCapitulo.set(m[2], lista);
  }

  const capitulos: CapituloNodo[] = (temario?.capitulos ?? []).map((cap) => ({
    slug: cap.slug,
    titulo: cap.titulo,
    url: `/temario/${DISCIPLINA}/${cap.slug}/`,
    terminos: (porCapitulo.get(cap.slug) ?? []).sort((a, b) =>
      a.nombre.localeCompare(b.nombre, 'es'),
    ),
  }));

  return (
    <div>
      <h1 className="text-4xl font-semibold tracking-tight text-neutro-950">Mapa de conocimiento</h1>
      <p className="mt-2 max-w-2xl text-neutro-500">
        Los capítulos de {nombreDisciplina(DISCIPLINA)} y sus términos, de un
        vistazo. Pulsa un capítulo para ver sus términos en el panel; desde ahí
        abres el capítulo o cualquier término.
      </p>

      {/* Grafo (escritorio) */}
      <div className="mt-6 hidden text-tinta lg:block">
        <GrafoConocimiento
          centro={nombreDisciplina(DISCIPLINA)}
          capitulos={capitulos}
        />
      </div>

      {/* Lista de respaldo (móvil y accesibilidad) */}
      <div className="mt-8 flex flex-col gap-6 lg:hidden">
        {capitulos.map((cap) => (
          <section key={cap.slug}>
            <Link
              href={cap.url}
              className="text-lg font-medium hover:text-acento"
            >
              {cap.titulo}
            </Link>
            {cap.terminos.length > 0 && (
              <ul className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-black/55">
                {cap.terminos.map((t) => (
                  <li key={t.id}>
                    <Link href={t.url} className="hover:text-acento">
                      {t.nombre}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
