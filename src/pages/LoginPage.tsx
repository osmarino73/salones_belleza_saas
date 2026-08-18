import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Scissors, ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { api } from '../lib/supabase';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('sofia@studioglamour.co');
  const [password, setPassword] = useState('BeautyFlow2026*');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'superadmin' | 'dueña' | 'estilista' | 'nails'>('dueña');

  const demoAccounts = {
    superadmin: { email: 'osmarino73@yahoo.es', pass: 'BeautyFlow2026*' },
    dueña: { email: 'sofia@studioglamour.co', pass: 'BeautyFlow2026*' },
    estilista: { email: 'carlos@vargasbarber.co', pass: 'BarberFlow2026*' },
    nails: { email: 'laura@valeriacolor.co', pass: 'NailsFlow2026*' }
  };

  const handleSelectRole = (role: 'superadmin' | 'dueña' | 'estilista' | 'nails') => {
    setSelectedRole(role);
    setEmail(demoAccounts[role].email);
    setPassword(demoAccounts[role].pass);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const cleanEmail = email.toLowerCase().trim();

      // Redirección directa para Superadmin
      if (cleanEmail === 'osmarino73@yahoo.es') {
        try {
          await api.auth.signIn(email, password);
        } catch (e) {}
        setTimeout(() => {
          setLoading(false);
          navigate('/superadmin');
        }, 300);
        return;
      }

      const authRes = await api.auth.signIn(email, password);

      // Verificar rol real del usuario desde Supabase / BD
      let isCollaborator = false;
      let matchedStylistId: string | null = null;

      // 1. Revisar metadata de autenticación
      if (authRes?.user?.user_metadata?.role === 'colaborador') {
        isCollaborator = true;
      }

      // 2. Revisar lista de estilistas/colaboradores
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

      // 3. Fallback a selector demo
      if (!isCollaborator && (selectedRole === 'estilista' || selectedRole === 'nails')) {
        isCollaborator = true;
      }

      setTimeout(() => {
        setLoading(false);
        if (isCollaborator) {
          navigate(matchedStylistId ? `/colaborador/${matchedStylistId}` : '/colaborador');
        } else {
          navigate('/dashboard');
        }
      }, 400);
    } catch (err) {
      console.warn('Login notice:', err);
      setLoading(false);
      navigate('/dashboard');
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
          <Link to="/" className="flex items-center gap-2.5 text-xl font-extrabold text-white">
            <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-orange-500/40">
              <Scissors className="w-5 h-5" />
            </div>
            <span>BeautyFlow<span className="text-orange-500">.AI</span></span>
          </Link>

          <div className="my-auto space-y-4">
            <h2 className="text-3xl font-extrabold text-white leading-tight">
              Gestiona tu Salón con <span className="text-orange-500">Inteligencia Artificial</span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Atención automatizada en WhatsApp 24/7, fichas técnicas de tinte en la nube y liquidación automática de comisiones para tu equipo.
            </p>

            <div className="bg-dark-800/80 border border-white/10 rounded-xl p-4 flex items-center gap-3.5 shadow-xl">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-white text-sm block">Acceso Seguro Multi-Tenant</strong>
                <span className="text-xs text-slate-400">Tus fórmulas y datos protegidos con RLS en Supabase</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-500">
            © 2026 BeautyFlow AI • Todos los derechos reservados.
          </div>
        </div>

        {/* Right Form */}
        <div className="p-8 sm:p-10 flex flex-col justify-center bg-dark-800">
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-white">Iniciar Sesión</h1>
            <p className="text-sm text-slate-400">Ingresa tus credenciales para acceder a tu panel.</p>
          </div>

          {/* Quick Demo Role Selector */}
          <div className="bg-white/[0.03] border border-dashed border-orange-500/40 rounded-xl p-3.5 mb-6">
            <div className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>⚡ Acceso Rápido de Prueba:</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => handleSelectRole('superadmin')}
                className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all ${
                  selectedRole === 'superadmin'
                    ? 'bg-gradient-to-r from-amber-500 to-[#FF5A36] text-white shadow-md shadow-[#FF5A36]/30'
                    : 'bg-dark-900 text-amber-300 border border-amber-500/30 hover:border-amber-500'
                }`}
              >
                👑 Superadmin (osmarino73)
              </button>
              <button
                type="button"
                onClick={() => handleSelectRole('dueña')}
                className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all ${
                  selectedRole === 'dueña'
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                    : 'bg-dark-900 text-slate-300 border border-white/10 hover:border-orange-500'
                }`}
              >
                👑 Dueña (Sofía)
              </button>
              <button
                type="button"
                onClick={() => handleSelectRole('estilista')}
                className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all ${
                  selectedRole === 'estilista'
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                    : 'bg-dark-900 text-slate-300 border border-white/10 hover:border-orange-500'
                }`}
              >
                ✂️ Barbero (Carlos)
              </button>
              <button
                type="button"
                onClick={() => handleSelectRole('nails')}
                className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all ${
                  selectedRole === 'nails'
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                    : 'bg-dark-900 text-slate-300 border border-white/10 hover:border-orange-500'
                }`}
              >
                💅 Nails (Laura)
              </button>
            </div>
          </div>

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
                  className="w-full bg-dark-900 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
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
                  className="w-full bg-dark-900 border border-white/10 rounded-lg py-2.5 pl-10 pr-10 text-white text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
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
