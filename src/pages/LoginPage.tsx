import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Scissors, ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { api } from '../lib/supabase';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const cleanEmail = email.toLowerCase().trim();
      const authRes = await api.auth.signIn(cleanEmail, password);

      if (authRes?.error || !authRes?.user) {
        setErrorMessage('Credenciales inválidas. Por favor verifica tu correo y contraseña.');
        setLoading(false);
        return;
      }

      const user = authRes.user;
      const isSuperadmin = api.auth.isSuperadmin(user);

      // 1. Si es Superadmin autenticado
      if (isSuperadmin) {
        const queryParams = new URLSearchParams(window.location.search);
        const redirect = queryParams.get('redirect');
        setTimeout(() => {
          setLoading(false);
          navigate(redirect || '/superadmin');
        }, 300);
        return;
      }

      // 2. Verificar si es Colaborador / Estilista
      let isCollaborator = false;
      let matchedStylistId: string | null = null;

      if (user?.user_metadata?.role === 'colaborador') {
        isCollaborator = true;
      }

      try {
        const allStylists = await api.getStylists();
        const found = allStylists.find(s => s.email?.toLowerCase().trim() === cleanEmail);
        if (found) {
          matchedStylistId = found.id;
          if (!found.is_owner && found.role !== 'admin') {
            isCollaborator = true;
          }
        }
      } catch (err) {}

      setTimeout(() => {
        setLoading(false);
        if (isCollaborator) {
          navigate(matchedStylistId ? `/colaborador/${matchedStylistId}` : '/colaborador');
        } else {
          navigate('/dashboard');
        }
      }, 300);
    } catch (err: any) {
      console.warn('Login error:', err);
      setErrorMessage('Ocurrió un error al iniciar sesión. Verifica tu conexión e intenta de nuevo.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Aura */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Card */}
      <div className="w-full max-w-5xl bg-dark-700 border border-orange-500/30 rounded-2xl shadow-2xl grid grid-cols-1 lg:grid-cols-2 overflow-hidden z-10">
        
        {/* Left Showcase (Desktop) */}
        <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-b from-dark-800/90 to-dark-900/95 relative border-r border-white/10">
          <Link to="/" className="flex items-center gap-2.5 text-2xl font-black text-white">
            <img
              src="/kowy-logo.jpg"
              alt="Kowy Logo"
              className="w-10 h-10 rounded-xl object-contain shadow-lg shadow-[#FF5A36]/30"
            />
            <span>Kowy<span className="text-[#FF5A36]">.app</span></span>
          </Link>

          <div className="my-auto space-y-4">
            <h2 className="text-3xl font-extrabold text-white leading-tight">
              Gestiona tu Negocio con <span className="text-[#FF5A36]">Inteligencia Artificial</span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Atención automatizada en WhatsApp 24/7 con Kowy IA, reservas online en 30 segundos y control total de caja POS.
            </p>

            <div className="bg-dark-800/80 border border-white/10 rounded-xl p-4 flex items-center gap-3.5 shadow-xl">
              <div className="w-10 h-10 rounded-full bg-[#FF5A36]/20 text-[#FF5A36] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-white text-sm block">Acceso Seguro Kowy Multi-Tenant</strong>
                <span className="text-xs text-slate-400">Tus datos y agenda protegidos en la nube</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-500">
            © 2026 Kowy.app • Todos los derechos reservados.
          </div>
        </div>

        {/* Right Form */}
        <div className="p-8 sm:p-10 flex flex-col justify-center bg-dark-800">
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-white">Iniciar Sesión</h1>
            <p className="text-sm text-slate-400">Ingresa tus credenciales para acceder a tu panel.</p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center gap-2 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Correo Electrónico o WhatsApp
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ej. dueña@misalon.co o usuario@beautyflow.app"
                  className="w-full bg-dark-900 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 placeholder:text-slate-600"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Contraseña
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-dark-900 border border-white/10 rounded-lg py-2.5 pl-10 pr-10 text-white text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 placeholder:text-slate-600"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-500 hover:text-orange-500"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-orange-500 rounded" />
                <span>Recordarme</span>
              </label>
              <a href="#recuperar" className="text-orange-500 hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 transition-all active:scale-[0.99]"
            >
              {loading ? (
                <span>Autenticando...</span>
              ) : (
                <>
                  <span>Ingresar al Panel</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            ¿Tu salón aún no tiene cuenta?{' '}
            <Link to="/registro" className="text-orange-500 font-bold hover:underline">
              Registrar Mi Salón Gratis →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
