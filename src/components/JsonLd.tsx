/**
 * Inserta un bloque de datos estructurados schema.org (JSON-LD).
 * Se renderiza en servidor; no envía nada al cliente salvo el <script>.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // El contenido es nuestro, generado en build; no hay entrada de usuario.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
