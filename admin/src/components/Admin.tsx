'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  getSupabase,
  supabaseConfigurado,
  type FuenteRow,
} from '@/lib/supabase';

const TIPOS = ['web', 'snapshot', 'pdf', 'texto'] as const;

function aLista(valor: string): string[] {
  return valor
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function Admin() {
  const supabase = getSupabase();

  const [cargando, setCargando] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sesion, setSesion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // --- Sesión ---
  useEffect(() => {
    if (!supabase) {
      setCargando(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSesion(data.session?.user.email ?? null);
      setCargando(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setSesion(session?.user.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!supabase) return;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setPassword('');
  }

  async function salir() {
    await supabase?.auth.signOut();
  }

  if (cargando) {
    return <p className="text-black/50">Cargando…</p>;
  }

  if (!supabaseConfigurado) {
    return (
      <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm">
        <p className="font-medium">Falta configurar Supabase.</p>
        <p className="mt-1 text-black/70">
          Define <code>NEXT_PUBLIC_SUPABASE_URL</code> y{' '}
          <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> en <code>.env.local</code>{' '}
          (local) y en las variables de entorno de Netlify (producción).
        </p>
      </div>
    );
  }

  if (!sesion) {
    return (
      <div className="max-w-sm">
        <h1 className="text-2xl font-semibold tracking-tight">Panel de CtrlZ</h1>
        <p className="mt-1 text-sm text-black/60">Accede para gestionar fuentes.</p>
        <form onSubmit={entrar} className="mt-6 flex flex-col gap-3">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-black/15 px-3 py-2 outline-none focus:border-acento"
          />
          <input
            type="password"
            required
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-black/15 px-3 py-2 outline-none focus:border-acento"
          />
          <button
            type="submit"
            className="rounded-lg bg-acento px-4 py-2 text-white font-medium hover:opacity-90"
          >
            Entrar
          </button>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>
      </div>
    );
  }

  return <PanelFuentes email={sesion} onSalir={salir} />;
}

function PanelFuentes({
  email,
  onSalir,
}: {
  email: string;
  onSalir: () => void;
}) {
  const supabase = getSupabase()!;
  const [fuentes, setFuentes] = useState<FuenteRow[]>([]);
  const [tipo, setTipo] = useState<(typeof TIPOS)[number]>('web');
  const [titulo, setTitulo] = useState('');
  const [url, setUrl] = useState('');
  const [texto, setTexto] = useState('');
  const [conceptos, setConceptos] = useState('');
  const [etiquetas, setEtiquetas] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    const { data, error } = await supabase
      .from('fuentes')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) setError(error.message);
    else setFuentes((data as FuenteRow[]) ?? []);
  }, [supabase]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  async function crear(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setAviso(null);
    setEnviando(true);
    const { error } = await supabase.from('fuentes').insert({
      tipo,
      titulo: titulo.trim(),
      url: url.trim() || null,
      texto: texto.trim(),
      conceptos: aLista(conceptos),
      etiquetas: aLista(etiquetas),
    });
    setEnviando(false);
    if (error) {
      setError(error.message);
      return;
    }
    setTitulo('');
    setUrl('');
    setTexto('');
    setConceptos('');
    setEtiquetas('');
    setAviso('Fuente guardada.');
    cargar();
  }

  async function eliminar(id: string) {
    const { error } = await supabase.from('fuentes').delete().eq('id', id);
    if (error) setError(error.message);
    else cargar();
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Fuentes</h1>
          <p className="text-sm text-black/50">{email}</p>
        </div>
        <button
          onClick={onSalir}
          className="rounded-lg border border-black/15 px-3 py-1.5 text-sm hover:border-acento hover:text-acento"
        >
          Salir
        </button>
      </div>

      <form
        onSubmit={crear}
        className="flex flex-col gap-3 rounded-xl border border-black/10 p-4"
      >
        <h2 className="font-medium">Añadir fuente</h2>
        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value as (typeof TIPOS)[number])}
            className="rounded-lg border border-black/15 px-3 py-2 outline-none focus:border-acento"
          >
            {TIPOS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <input
            required
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="flex-1 rounded-lg border border-black/15 px-3 py-2 outline-none focus:border-acento"
          />
        </div>
        <input
          type="url"
          placeholder="URL (opcional, para web/snapshot/pdf)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="rounded-lg border border-black/15 px-3 py-2 outline-none focus:border-acento"
        />
        <textarea
          placeholder="Texto de la fuente (lo que se indexará). De momento, pégalo a mano; la extracción automática llegará con la GitHub Action."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows={5}
          className="rounded-lg border border-black/15 px-3 py-2 outline-none focus:border-acento"
        />
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            placeholder="Conceptos (slugs, separados por comas)"
            value={conceptos}
            onChange={(e) => setConceptos(e.target.value)}
            className="flex-1 rounded-lg border border-black/15 px-3 py-2 outline-none focus:border-acento"
          />
          <input
            placeholder="Etiquetas (separadas por comas)"
            value={etiquetas}
            onChange={(e) => setEtiquetas(e.target.value)}
            className="flex-1 rounded-lg border border-black/15 px-3 py-2 outline-none focus:border-acento"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={enviando}
            className="rounded-lg bg-acento px-4 py-2 text-white font-medium hover:opacity-90 disabled:opacity-50"
          >
            {enviando ? 'Guardando…' : 'Guardar fuente'}
          </button>
          {aviso && <span className="text-sm text-green-600">{aviso}</span>}
          {error && <span className="text-sm text-red-600">{error}</span>}
        </div>
      </form>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-black/40">
          {fuentes.length} fuente{fuentes.length === 1 ? '' : 's'}
        </h2>
        <ul className="mt-3 flex flex-col divide-y divide-black/10">
          {fuentes.map((f) => (
            <li key={f.id} className="flex items-start justify-between gap-4 py-3">
              <div className="min-w-0">
                <p className="font-medium truncate">{f.titulo}</p>
                <p className="text-xs text-black/50">
                  {f.tipo} · {f.estado}
                  {f.url ? (
                    <>
                      {' · '}
                      <a href={f.url} target="_blank" rel="noreferrer" className="underline">
                        enlace
                      </a>
                    </>
                  ) : null}
                </p>
              </div>
              <button
                onClick={() => eliminar(f.id)}
                className="shrink-0 text-sm text-black/40 hover:text-red-600"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
