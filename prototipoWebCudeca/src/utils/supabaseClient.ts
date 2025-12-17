import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './supabase/info';

// Crear una ÚNICA instancia de Supabase para toda la aplicación
export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey,
  {
    auth: {
      persistSession: false, // Desactivar persistencia de sesión de Supabase Auth
      autoRefreshToken: false,
    }
  }
);
