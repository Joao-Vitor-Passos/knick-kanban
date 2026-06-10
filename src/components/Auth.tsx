'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { KeyRound, Mail, Loader2 } from 'lucide-react';

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) {
        setMessage({ text: error.message, isError: true });
      } else {
        setMessage({ text: 'Verifique seu e-mail para confirmar o cadastro!', isError: false });
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage({ text: error.message, isError: true });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-neutral-900 rounded-2xl border border-neutral-800 p-8 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-neutral-100">
            <span className="text-blue-500">Knick</span>
            <span className="text-orange-500">.</span>
          </h1>
          <p className="text-sm text-neutral-400 mt-2">
            {isSignUp ? 'Crie sua conta para organizar seus boards' : 'Acesse seus painéis organizacionais'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-neutral-500" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@exemplo.com"
                className="w-full bg-neutral-950 text-neutral-100 pl-10 pr-4 py-2.5 rounded-xl border border-neutral-800 focus:outline-none focus:border-blue-500 text-sm transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Senha</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 text-neutral-500" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-neutral-950 text-neutral-100 pl-10 pr-4 py-2.5 rounded-xl border border-neutral-800 focus:outline-none focus:border-blue-500 text-sm transition-all"
              />
            </div>
          </div>

          {message && (
            <div className={`p-3 rounded-xl text-xs font-medium border ${
              message.isError ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-green-500/10 border-green-500/20 text-green-400'
            }`}>
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/10 disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : isSignUp ? 'Registrar' : 'Entrar'}
          </button>
        </form>

        <div className="text-center mt-6 pt-6 border-t border-neutral-800">
          <button
            onClick={() => { setIsSignUp(!isSignUp); setMessage(null); }}
            className="text-xs font-medium text-neutral-400 hover:text-orange-500 transition-colors"
          >
            {isSignUp ? 'Já possui uma conta? Entre por aqui' : 'Não tem conta? Cadastre-se de graça'}
          </button>
        </div>
      </div>
    </div>
  );
}