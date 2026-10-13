# CtrlZ

Plataforma de conocimiento de diseño para **resolver dudas**: escribe la duda con tus
palabras y llegas al concepto correcto, aunque no recuerdes su nombre. El MVP arranca
con **Diseño Editorial** y está preparado para crecer a otras disciplinas.

- **Arquitectura:** *static-first*. El contenido vive en el repositorio, Next.js lo
  compila a un sitio **estático** y el buscador funciona en el navegador. Sin servidor
  ni base de datos en producción → coste cero.
- **Stack:** Next.js (App Router) · TypeScript · Tailwind · Zod · Orama (búsqueda).

---

## 1. Requisitos

- **Node.js 20 LTS** o superior (`node -v`).
- Git y una cuenta de GitHub.

## 2. Arrancar en local

```bash
npm install
npm run dev
```

Abre **http://localhost:3000**. El comando `dev` genera primero el índice de búsqueda
(`npm run index`) y luego levanta Next.

Para generar la versión de producción (sitio estático en la carpeta `out/`):

```bash
npm run build
```

## 3. Subir a GitHub

Crea un repositorio **vacío** en GitHub (sin README ni .gitignore) y luego:

```bash
git init
git add .
git commit -m "CtrlZ: scaffold inicial"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/ctrlz.git
git push -u origin main
```

> Si usas la **GitHub CLI**, en un solo paso:
> `gh repo create ctrlz --private --source=. --push`

## 4. Desplegar en Netlify

1. En Netlify: **Add new site → Import an existing project** y elige tu repo de GitHub.
2. Netlify leerá `netlify.toml` automáticamente:
   - Build command: `npm run build`
   - Publish directory: `out`
3. Deploy. Cada *push* a `main` vuelve a desplegar.

## 5. Añadir o editar conceptos

Cada concepto es un archivo en `content/editorial/<slug>.mdx` con *frontmatter* +
una explicación. Ejemplo mínimo:

```mdx
---
id: viuda
nombre: Viuda
definicion: Última línea de un párrafo que queda aislada al principio de una columna.
categoria: maquetacion
nivel: basico
consultas:
  - línea suelta al final de un párrafo
relaciones:
  - { tipo: relacionado_con, destino: maqueta }
---
Explicación ampliada del concepto…
```

Reglas útiles:

- El `id` es el *slug* (URL): `/editorial/viuda/`.
- Declara una relación en **una** dirección; la inversa se genera sola en el build
  (si pones `parte_de`, el otro concepto recibe `tiene_parte`).
- El `destino` de cada relación debe ser el `id` de un concepto existente, o el build
  fallará (es a propósito: evita enlaces rotos).

Tras guardar, `npm run dev` reconstruye el índice y la ficha aparece en el buscador.

## 6. Estructura

```
content/editorial/      Fichas de concepto (MDX) — el contenido
public/search/          Índice generado en el build (no se edita a mano)
scripts/build-index.ts  Genera el índice de búsqueda
src/lib/                schema (Zod), carga de fichas, grafo de relaciones, búsqueda
src/components/         Buscador, ficha, relaciones
src/app/                Páginas (home, buscar, diccionario, ficha, disciplina)
supabase/               Esquema de referencia para la futura ingesta de fuentes
.github/workflows/      Plantilla de ingesta (fase de administración, aún no activa)
```

## 7. Próximas fases (no incluidas en el MVP)

- **Panel de administración + ingesta de fuentes** (URL, snapshot, PDF, texto) sobre
  **Supabase** (auth + BD + almacenamiento) y **GitHub Actions** para el procesado.
- **Búsqueda semántica** con *embeddings* precalculados.
- **IA local** (Ollama) para explicar y resumir sobre la base de conocimiento.

La propuesta técnica completa (con el roadmap y el tablero de seguimiento) está en el
documento del proyecto.
