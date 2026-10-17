import { createClient } from '@supabase/supabase-js';
import { api, supabase, isSupabaseConfigured } from './supabase';
import { ProspectSite, Tenant } from '../types';

export interface ActivateProspectInFieldParams {
  prospect: ProspectSite;
  ownerEmail: string;
  tempPassword?: string;
  agentEmail?: string;
  trialDays?: number;
}

export interface ActivationFieldResult {
  success: boolean;
  tenant?: Tenant;
  ownerEmail: string;
  tempPassword: string;
  loginUrl: string;
  trialDays: number;
  error?: string;
}

/**
 * Servicio de activación B2B en calle:
 * Activa al salón con días de prueba gratis en el Plan Inicio ($29.000 COP)
 * utilizando un cliente efímero para NO desloguear al agente de campo de su teléfono móvil.
 */
export async function activateProspectInField(
  params: ActivateProspectInFieldParams
): Promise<ActivationFieldResult> {
  const { prospect, ownerEmail, agentEmail } = params;
  const trialDays = params.trialDays || 14;
  const cleanEmail = ownerEmail.trim().toLowerCase();
  const cleanName = prospect.business_name.replace(/[^a-zA-Z]/g, '').slice(0, 4) || 'Salon';
  const tempPassword = params.tempPassword || `${cleanName}${Math.floor(1000 + Math.random() * 9000)}*`;
  const loginUrl = `${window.location.origin}/login`;

  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    // 1. Cliente efímero aislado sin persistencia de sesión
    if (supabaseUrl && supabaseAnonKey && isSupabaseConfigured) {
      const ephemeralClient = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false
        }
      });

      // Crear usuario en Auth sin tocar sesión del agente
      try {
        await ephemeralClient.auth.signUp({
          email: cleanEmail,
          password: tempPassword,
          options: {
            data: {
              name: `${prospect.business_name} (Admin)`,
              business_name: prospect.business_name,
              source: 'kowy_agente_campo',
              agent_email: agentEmail
            }
          }
        });
      } catch (authErr) {
        console.warn('Auth notice in field ephemeral client:', authErr);
      }
    }

    // 2. Activar como Tenant en Kowy con días gratis en Plan Inicio
    const res = await api.activateProspectAsTenant({
      prospectId: prospect.id,
      prospect,
      ownerEmail: cleanEmail,
      tempPassword,
      businessName: prospect.business_name,
      phoneWhatsapp: prospect.phone_whatsapp,
      trialDays // Días de prueba configurables (7 u 8)
    });

    if (res.success && res.tenant) {
      // 3. Vincular email del asesor de campo en prospect_sites
      if (supabase && isSupabaseConfigured) {
        await supabase.from('prospect_sites').update({
          status: 'reclamado',
          claimed_tenant_id: res.tenant.id,
          owner_email: cleanEmail,
          creator_email: agentEmail || prospect.creator_email
        }).eq('id', prospect.id);
      }

      return {
        success: true,
        tenant: res.tenant,
        ownerEmail: cleanEmail,
        tempPassword,
        loginUrl,
        trialDays
      };
    }

    return {
      success: false,
      ownerEmail: cleanEmail,
      tempPassword,
      loginUrl,
      trialDays,
      error: res.error || 'No se pudo completar la activación del salón'
    };

  } catch (err: any) {
    console.error('Error en activación en campo:', err);
    return {
      success: false,
      ownerEmail: cleanEmail,
      tempPassword,
      loginUrl,
      trialDays,
      error: err.message || 'Error inesperado durante la activación'
    };
  }
}
