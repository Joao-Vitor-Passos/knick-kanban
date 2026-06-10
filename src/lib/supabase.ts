import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Se as variáveis não existirem, avisa no console de forma limpa em vez de quebrar o app
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️ Atenção: As variáveis de ambiente do Supabase não foram encontradas no seu .env.local. Verifique o arquivo e reinicie o servidor.'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
);