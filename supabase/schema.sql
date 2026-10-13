-- CtrlZ · esquema de referencia para el panel de administración e ingesta de fuentes.
-- NO se usa en el MVP (el sitio público es estático). Se aplicará en Supabase
-- cuando montemos el panel. Guardamos TEXTO + metadatos + enlace, nunca binarios pesados.

create table if not exists fuentes (
  id      text primary key,
  tipo    text not null,          -- web | snapshot | pdf | texto
  titulo  text not null,
  url     text,
  texto   text not null,          -- texto extraído (lo que se indexa)
  fecha   timestamptz default now(),
  estado  text not null default 'pendiente'  -- pendiente | procesada | revisada
);

create table if not exists conceptos (
  id          text primary key,   -- slug
  nombre      text not null,
  definicion  text not null,
  explicacion text,
  categoria   text not null,
  disciplina  text not null default 'editorial',
  nivel       text not null default 'basico'
);

create table if not exists concepto_fuente (
  concepto_id text not null references conceptos(id),
  fuente_id   text not null references fuentes(id),
  primary key (concepto_id, fuente_id)
);
