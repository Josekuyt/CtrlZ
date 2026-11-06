import type { Metadata } from 'next';
import Link from 'next/link';
import { cargarTemario, nombreDisciplina, obtenerCapitulo } from '@/lib/temario';
import { obtenerTodos } from '@/lib/datos';
import { refsTemario } from '@/lib/schema';
import GrafoGlobal, { type CapNodo, type Puente } from '@/components/GrafoGlobal';

export const metadata: Metadata = {
  title: 'Mapa',
  alternates: { canonical: '/grafo/' },
  description:
    'Mapa de conocimiento: cómo se conectan las disciplinas a través de los conceptos que comparten.',
};

// Las dos disciplinas con contenido hoy. Al añadir más, este mapa crecerá.
const IZQ = 'editorial';
const DER = 'tipografia';
const RE = /^\/temario\/([^/]+)\/([^/]+)\//;

export default function GrafoPage() {
  const temario = cargarTemario();
  const ordenCap = new Map<string, number>();
  for (const d of temario) {
    d.capitulos.forEach((c) => ordenCap.set(`${d.slug}/${c.slug}`, c.orden));
  }

  // Conceptos «puente»: los que se explican en ambas disciplinas.
  const puentes: Puente[] = [];
  const keysIzq = new Set<string>();
  const keysDer = new Set<string>();

  for (const c of obtenerTodos()) {
    let izqKey: string | null = null;
    let derKey: string | null = null;
    for (const ref of refsTemario(c)) {
      const m = RE.exec(ref.trim());
      if (!m) continue;
      const key = `${m[1]}/${m[2]}`;
      if (m[1] === IZQ && !izqKey) izqKey = key;
      if (m[1] === DER && !derKey) derKey = key;
    }
    if (izqKey && derKey) {
      puentes.push({
        id: c.id,
        nombre: c.nombre,
        url: `/glosario/${c.disciplina}/${c.id}/`,
        izqKey,
        derKey,
      });
      keysIzq.add(izqKey);
      keysDer.add(derKey);
    }
  }
  puentes.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));

  const capNodo = (key: string): CapNodo => {
    const [disc, cap] = key.split('/');
    return { key, titulo: obtenerCapitulo(disc, cap)?.titulo ?? cap, url: `/temario/${disc}/${cap}/` };
  };
  const ordenar = (keys: Set<string>) =>
    [...keys].sort((a, b) => (ordenCap.get(a) ?? 99) - (ordenCap.get(b) ?? 99)).map(capNodo);

  const capsIzq = ordenar(keysIzq);
  const capsDer = ordenar(keysDer);
  const tituloDe = new Map([...capsIzq, ...capsDer].map((c) => [c.key, c.titulo]));

  return (
    <div>
      <h1 className="text-4xl font-semibold tracking-tight text-neutro-950">
        Mapa de conocimiento
      </h1>
      <p className="mt-2 max-w-2xl text-neutro-500">
        Muchos conceptos se explican en más de una disciplina. Son el puente que las
        conecta: aquí se ve cómo {nombreDisciplina(IZQ)} y {nombreDisciplina(DER)}{' '}
        confluyen a través de un vocabulario común.
      </p>

      {puentes.length === 0 ? (
        <p className="mt-8 text-neutro-500">
          Todavía no hay conceptos compartidos entre disciplinas.
        </p>
      ) : (
        <>
          {/* Grafo (escritorio) */}
          <div className="mt-10 hidden lg:block">
            <GrafoGlobal
              izquierda={{ slug: IZQ, nombre: nombreDisciplina(IZQ), capitulos: capsIzq }}
              derecha={{ slug: DER, nombre: nombreDisciplina(DER), capitulos: capsDer }}
              puentes={puentes}
            />
          </div>

          {/* Respaldo en móvil y accesibilidad: lista por concepto */}
          <ul className="mt-8 flex flex-col divide-y divide-neutro-100 lg:hidden">
            {puentes.map((p) => (
              <li key={p.id} className="py-3">
                <Link href={p.url} className="font-medium text-neutro-900 hover:text-rojo-600">
                  {p.nombre}
                </Link>
                <p className="mt-0.5 text-sm text-neutro-500">
                  {tituloDe.get(p.izqKey)} · {nombreDisciplina(IZQ)}
                  <span className="mx-1 text-neutro-300">↔</span>
                  {tituloDe.get(p.derKey)} · {nombreDisciplina(DER)}
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
