import { createClient } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { ProspectSite } from '../types/keweBeauty';

export interface ActivateProspectParams {
  prospect: ProspectSite;
  ownerEmail: string;
  tempPassword: string;
  agentEmail?: string;
  plan?: 'free' | 'pro' | 'vip';
}

export interface ActivationResult {
  success: boolean;
  tenantId?: string;
  ownerEmail: string;
  tempPassword: string;
  loginUrl: string;
  error?: string;
}

/**
 * Servicio de activación B2B en caliente:
 * Crea el usuario del dueño del salón en Supabase Auth mediante un cliente efímero
 * para NO destruir ni desloguear la sesión del agente de campo en su teléfono.
 */
export async function activateProspectInField(params: ActivateProspectParams): Promise<ActivationResult> {
  const { prospect, ownerEmail, tempPassword, agentEmail, plan = 'free' } = params;
  const cleanEmail = ownerEmail.trim().toLowerCase();

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Variables de entorno de Supabase no configuradas');
  }

  // 1. Cliente efímero aislado sin persistencia de sesión
  const ephemeralClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });

  try {
    // 2. Registro de la cuenta del dueño del salón
    const { data: authData, error: signUpErr } = await ephemeralClient.auth.signUp({
      email: cleanEmail,
      password: tempPassword,
      options: {
        data: {
          nombre_negocio: prospect.business_name,
          plan: plan,
          source: 'kewe_agente_campo'
        }
      }
    });

    if (signUpErr || !authData.user) {
      throw new Error(signUpErr?.message || 'Error al registrar el dueño del salón');
    }

    const tenantId = authData.user.id;

    // 3. Vincular prospecto en prospect_sites con claimed_tenant_id y status 'reclamado'
    await supabase.from('prospect_sites').update({
      status: 'reclamado',
      claimed_tenant_id: tenantId,
      creator_email: agentEmail || 'agente@kewe.app'
    }).eq('id', prospect.id);

    return {
      success: true,
      tenantId,
      ownerEmail: cleanEmail,
      tempPassword,
      loginUrl: `${window.location.origin}/login`
    };

  } catch (err: any) {
    console.error('Error en activación de prospecto:', err);
    return {
      success: false,
      ownerEmail: cleanEmail,
      tempPassword,
      loginUrl: `${window.location.origin}/login`,
      error: err.message || 'Error desconocido'
    };
  }
}
