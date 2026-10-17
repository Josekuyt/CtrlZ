import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sobre CtrlZ',
  description: 'Qué es CtrlZ, por qué existe y cómo funciona.',
};

export default function SobrePage() {
  return (
    <article className="prose-ctrlz max-w-2xl">
      <h1 className="mb-8 text-4xl font-semibold tracking-tight text-neutro-950">Sobre CtrlZ</h1>

      <h2>Qué es</h2>
      <p>
        CtrlZ es una plataforma de conocimiento de diseño gráfico pensada para
        resolver dudas. Escribes lo que no recuerdas —con tus propias palabras— y
        te lleva al concepto o al apartado del temario que lo explica, aunque no
        sepas el término exacto.
      </p>
      <p>
        No es un chatbot ni un blog de artículos sueltos: es un cuerpo de
        conocimiento estructurado, pensado para consultarse rápido y con rigor.
      </p>

      <h2>Por qué «CtrlZ»</h2>
      <p>
        Como el atajo de deshacer: CtrlZ deshace ese bloqueo de «lo tengo en la
        punta de la lengua». Recuerdas la idea, pero no el nombre; aquí lo
        encuentras.
      </p>

      <h2>Cómo funciona</h2>
      <ul>
        <li>
          <strong>Buscador.</strong> Describe tu duda con lenguaje normal
          («el espacio entre columnas») y te lleva al término o al apartado
          correcto.
        </li>
        <li>
          <strong>Temario.</strong> El contenido organizado en capítulos y
          apartados, navegable como un manual. Es la fuente de la que salen las
          respuestas.
        </li>
        <li>
          <strong>Glosario.</strong> Los términos clave, cada uno con su
          definición y un enlace al apartado del temario donde se explica a fondo.
        </li>
      </ul>

      <h2>En qué punto está</h2>
      <p>
        CtrlZ arranca con <strong>Diseño Editorial</strong> y está construida para
        crecer a otras disciplinas (branding, tipografía, UX/UI, packaging…) sobre
        la misma base. Más adelante incorporará búsqueda por significado y, de
        forma opcional, respuestas redactadas a partir del propio temario.
      </p>

      <h2>Un proyecto en construcción</h2>
      <p>
        CtrlZ se desarrolla de forma abierta e incremental. Si echas en falta un
        concepto o ves algo mejorable, es parte del proceso: el contenido crece
        poco a poco.
      </p>

      <p className="mt-8">
        <Link href="/" className="text-rojo-600 underline underline-offset-2">
          Volver al inicio
        </Link>
      </p>
    </article>
  );
}
