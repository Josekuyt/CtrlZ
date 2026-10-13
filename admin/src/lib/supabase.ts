import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** True si las variables de entorno de Supabase están presentes. */
export const supabaseConfigurado = Boolean(url && anon);

let cliente: SupabaseClient | null = null;

/**
 * Cliente de Supabase para el navegador (panel /admin).
 * Devuelve null si faltan las variables de entorno, para que la UI
 * pueda avisar en lugar de romperse.
 */
export function getSupabase(): SupabaseClient | null {
  if (!supabaseConfigurado) return null;
  if (!cliente) {
    cliente = createClient(url as string, anon as string, {
      auth: { persistSession: true, autoRefreshToken: true },
    });
  }
  return cliente;
}

/** Forma de una fila de la tabla `fuentes`. */
export interface FuenteRow {
  id: string;
  tipo: 'web' | 'snapshot' | 'pdf' | 'texto';
  titulo: string;
  url: string | null;
  texto: string;
  conceptos: string[];
  etiquetas: string[];
  estado: 'pendiente' | 'procesada' | 'revisada';
  created_at: string;
}
