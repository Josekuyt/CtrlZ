import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { cache } from 'react';

const DIR = join(process.cwd(), 'content', 'temario');
const INDEX = '_index.md';

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

/** Lee el _index.md de una carpeta (entrada del temario). */
function leerEntrada(dir: string): matter.GrayMatterFile<string> | null {
  const f = join(dir, INDEX);
  if (!existsSync(f)) return null;
  return matter(readFileSync(f, 'utf8'));
}

function cargarCapitulo(disciplina: string, capSlug: string, capDir: string): Capitulo | null {
  const cap = leerEntrada(capDir);
  if (!cap) return null;

  const apartados: Apartado[] = [];
  for (const apSlug of readdirSync(capDir)) {
    const apDir = join(capDir, apSlug);
    if (!esDir(apDir)) continue;
    const ap = leerEntrada(apDir);
    if (!ap) continue;
    apartados.push({
      disciplina,
      capitulo: capSlug,
      slug: apSlug,
      orden: Number(ap.data.orden ?? 99),
      titulo: String(ap.data.titulo ?? apSlug),
      consultas: Array.isArray(ap.data.consultas) ? ap.data.consultas : [],
      html: marked.parse(ap.content) as string,
      texto: aTextoPlano(ap.content),
    });
  }
  apartados.sort((a, b) => a.orden - b.orden);

  return {
    disciplina,
    slug: capSlug,
    titulo: String(cap.data.titulo ?? capSlug),
    orden: Number(cap.data.orden ?? 99),
    descripcion: String(cap.data.descripcion ?? ''),
    intro: cap.content.trim() ? (marked.parse(cap.content) as string) : '',
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
      const cap = cargarCapitulo(discSlug, capSlug, capDir);
      if (cap) capitulos.push(cap);
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
