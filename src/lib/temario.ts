import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { cache } from 'react';

const DIR = join(process.cwd(), 'content', 'temario');

/** Nombres legibles de cada disciplina (el slug es la carpeta/ruta). */
export const NOMBRE_DISCIPLINA: Record<string, string> = {
  editorial: 'Diseño Editorial',
};

export function nombreDisciplina(slug: string): string {
  return NOMBRE_DISCIPLINA[slug] ?? slug;
}

export interface Apartado {
  disciplina: string;
  capitulo: string;
  slug: string;
  orden: number;
  titulo: string;
  consultas: string[];
  html: string;
  texto: string;
}

export interface Capitulo {
  disciplina: string;
  slug: string;
  titulo: string;
  orden: number;
  descripcion: string;
  intro: string;
  apartados: Apartado[];
}

export interface DisciplinaTemario {
  slug: string;
  titulo: string;
  capitulos: Capitulo[];
}

function esDir(p: string): boolean {
  try {
    return statSync(p).isDirectory();
  } catch {
    return false;
  }
}

function aTextoPlano(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#>*_`[\]!]/g, ' ')
    .replace(/\(([^)]*)\)/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function cargarCapitulo(disciplina: string, capSlug: string, capDir: string): Capitulo {
  const files = readdirSync(capDir);
  const metaRaw = files.includes('_capitulo.md')
    ? readFileSync(join(capDir, '_capitulo.md'), 'utf8')
    : '';
  const meta = matter(metaRaw);

  const apartados: Apartado[] = [];
  for (const f of files.filter((f) => /^\d+-.+\.md$/.test(f))) {
    const m = f.match(/^(\d+)-(.+)\.md$/)!;
    const raw = readFileSync(join(capDir, f), 'utf8');
    const { data, content } = matter(raw);
    apartados.push({
      disciplina,
      capitulo: capSlug,
      slug: m[2],
      orden: Number(data.orden ?? m[1]),
      titulo: String(data.titulo ?? m[2]),
      consultas: Array.isArray(data.consultas) ? data.consultas : [],
      html: marked.parse(content) as string,
      texto: aTextoPlano(content),
    });
  }
  apartados.sort((a, b) => a.orden - b.orden);

  return {
    disciplina,
    slug: capSlug,
    titulo: String(meta.data.titulo ?? capSlug),
    orden: Number(meta.data.orden ?? 99),
    descripcion: String(meta.data.descripcion ?? ''),
    intro: meta.content.trim() ? (marked.parse(meta.content) as string) : '',
    apartados,
  };
}

/** Carga el temario completo, agrupado por disciplina. Solo servidor. */
export const cargarTemario = cache((): DisciplinaTemario[] => {
  if (!existsSync(DIR)) return [];
  const disciplinas: DisciplinaTemario[] = [];

  for (const discSlug of readdirSync(DIR)) {
    const discDir = join(DIR, discSlug);
    if (!esDir(discDir)) continue;

    const capitulos: Capitulo[] = [];
    for (const capSlug of readdirSync(discDir)) {
      const capDir = join(discDir, capSlug);
      if (!esDir(capDir)) continue;
      capitulos.push(cargarCapitulo(discSlug, capSlug, capDir));
    }
    capitulos.sort((a, b) => a.orden - b.orden);

    disciplinas.push({ slug: discSlug, titulo: nombreDisciplina(discSlug), capitulos });
  }

  return disciplinas;
});

export function obtenerDisciplina(disc: string): DisciplinaTemario | undefined {
  return cargarTemario().find((d) => d.slug === disc);
}

export function obtenerCapitulo(disc: string, cap: string): Capitulo | undefined {
  return obtenerDisciplina(disc)?.capitulos.find((c) => c.slug === cap);
}

export function obtenerApartado(
  disc: string,
  cap: string,
  ap: string,
): Apartado | undefined {
  return obtenerCapitulo(disc, cap)?.apartados.find((a) => a.slug === ap);
}

/** Árbol ligero (sin html) de una disciplina, para el menú lateral. */
export function arbolTemario(disciplina: string) {
  const d = obtenerDisciplina(disciplina);
  if (!d) return [];
  return d.capitulos.map((c) => ({
    slug: c.slug,
    titulo: c.titulo,
    apartados: c.apartados.map((a) => ({ slug: a.slug, titulo: a.titulo })),
  }));
}

export type ArbolTemario = ReturnType<typeof arbolTemario>;
