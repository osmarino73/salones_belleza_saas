import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { ShieldAlert, Lock, ArrowLeft, LogOut, Loader2, Sparkles } from 'lucide-react';
import { api } from '../lib/supabase';

interface SuperadminGuardProps {
  children: React.ReactNode;
}

export const SuperadminGuard: React.FC<SuperadminGuardProps> = ({ children }) => {
  const location = useLocation();
  const [authState, setAuthState] = useState<{
    isLoading: boolean;
    isAuthenticated: boolean;
    isAuthorized: boolean;
    user: any | null;
  }>({
    isLoading: true,
    isAuthenticated: false,
    isAuthorized: false,
    user: null
  });

  useEffect(() => {
    let isMounted = true;

    async function verifySuperadminAccess() {
      try {
        const user = api.auth.getUser();
        if (!user) {
          if (isMounted) {
            setAuthState({
              isLoading: false,
              isAuthenticated: false,
              isAuthorized: false,
              user: null
            });
          }
          return;
        }

        const isSuperadmin = api.auth.isSuperadmin(user);

        if (isMounted) {
          setAuthState({
            isLoading: false,
            isAuthenticated: true,
            isAuthorized: isSuperadmin,
            user
          });
        }
      } catch (err) {
        if (isMounted) {
          setAuthState({
            isLoading: false,
            isAuthenticated: false,
            isAuthorized: false,
            user: null
          });
        }
      }
    }

    verifySuperadminAccess();

    return () => {
      isMounted = false;
    };
  }, [location.pathname]);

  // 1. Estado de carga de verificación de credenciales
  if (authState.isLoading) {
    return (
      <div className="min-h-screen bg-[#080B11] flex flex-col items-center justify-center p-4 text-white">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FF5A36] to-pink-500 flex items-center justify-center shadow-xl shadow-[#FF5A36]/30 mb-4 animate-pulse">
          <Lock className="w-8 h-8 text-white" />
        </div>
        <div className="flex items-center gap-2 text-sm font-black text-slate-300">
          <Loader2 className="w-4 h-4 animate-spin text-[#FF5A36]" />
          <span>Verificando credenciales de Súper Administrador...</span>
        </div>
      </div>
    );
  }

  // 2. Si NO está autenticado, redirigir a Login
  if (!authState.isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // 3. Si está autenticado pero NO es un Súper Administrador autorizado, mostrar 403 Restringido
  if (!authState.isAuthorized) {
    return (
      <div className="min-h-screen bg-[#080B11] text-white flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
        {/* Halos de advertencia */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-lg bg-[#141926]/90 border border-red-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6 text-center relative z-10 animate-fade-in">
          
          <div className="w-20 h-20 rounded-3xl bg-red-500/15 border-2 border-red-500/30 text-red-400 flex items-center justify-center mx-auto shadow-xl shadow-red-500/20">
            <ShieldAlert className="w-10 h-10 animate-bounce" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-red-400 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
              403 • Acceso Restringido
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Área Exclusiva Superadmin
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              La cuenta conectada <strong className="text-white font-mono bg-white/5 px-2 py-0.5 rounded-md">{authState.user?.email || 'Usuario'}</strong> no cuenta con privilegios de Súper Administrador en la plataforma central de Kowy.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-left text-xs space-y-2 text-slate-400">
            <div className="flex items-center gap-2 text-white font-bold">
              <Lock className="w-4 h-4 text-[#FF5A36]" />
              <span>Protección de Datos Multi-Tenant</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Para ver estadísticas globales, activar licencias de salones o crear prospectos, debes iniciar sesión con una cuenta de la administración central autorizada.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to="/dashboard"
              className="flex-1 bg-gradient-to-r from-[#FF5A36] to-pink-500 hover:opacity-95 text-white font-black py-3 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#FF5A36]/25 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Ir a Mi Panel de Salón</span>
            </Link>

            <button
              type="button"
              onClick={async () => {
                await api.auth.signOut();
                window.location.href = '/login?redirect=/superadmin';
              }}
              className="flex-1 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-bold py-3 px-4 rounded-2xl text-xs border border-white/10 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Cambiar de Cuenta</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  // 4. Usuario autenticado y 100% autorizado como Superadmin
  return <>{children}</>;
};

export default SuperadminGuard;
