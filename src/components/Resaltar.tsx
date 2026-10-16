import { tokensConsulta } from '@/lib/busqueda';

/** Resalta en `texto` las palabras significativas de `consulta`. */
export default function Resaltar({
  texto,
  consulta,
}: {
  texto: string;
  consulta: string;
}) {
  const tokens = tokensConsulta(consulta);
  if (tokens.length === 0) return <>{texto}</>;

  const escapados = tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const re = new RegExp(`(${escapados.join('|')})`, 'gi');
  const partes = texto.split(re);
  const set = new Set(tokens);

  return (
    <>
      {partes.map((p, i) =>
        set.has(p.toLowerCase()) ? (
          <mark key={i} className="bg-acento/15 text-inherit rounded px-0.5">
            {p}
          </mark>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}
