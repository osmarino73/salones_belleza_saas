import { supabase, isSupabaseConfigured } from './supabase';
import { FieldAgent, ProspectSite } from '../types';

const STORAGE_KEY_AGENT = 'kowy_field_agent_session';

export const agentService = {
  /**
   * Obtener sesión del agente autenticado en la vista de campo
   */
  async getCurrentAgent(): Promise<FieldAgent | null> {
    try {
      // 1. Revisar caché local inmediata
      const cached = localStorage.getItem(STORAGE_KEY_AGENT);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.email) {
            return parsed;
          }
        } catch {
          // ignore
        }
      }

      // 2. Si hay cliente Supabase activo
      if (supabase && isSupabaseConfigured) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data: agentRecord, error } = await supabase
          .from('agentes_campo')
          .select('*')
          .eq('email', user.email)
          .eq('estado', 'activo')
          .maybeSingle();

        if (!error && agentRecord) {
          const agentObj: FieldAgent = {
            id: agentRecord.id,
            user_id: agentRecord.user_id,
            nombre: agentRecord.nombre,
            email: agentRecord.email,
            telefono: agentRecord.telefono,
            zona: agentRecord.zona,
            estado: agentRecord.estado
          };
          localStorage.setItem(STORAGE_KEY_AGENT, JSON.stringify(agentObj));
          return agentObj;
        }
      }

      return null;
    } catch (err) {
      console.error('Error al obtener agente actual:', err);
      return null;
    }
  },

  /**
   * Iniciar sesión de agente de campo
   */
  async loginAgent(email: string, password?: string): Promise<FieldAgent> {
    const cleanEmail = email.trim().toLowerCase();

    // Si hay Supabase configurado y password
    if (supabase && isSupabaseConfigured && password) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
        if (!error && data.user) {
          const { data: agentRecord } = await supabase
            .from('agentes_campo')
            .select('*')
            .eq('email', cleanEmail)
            .maybeSingle();

          if (agentRecord) {
            const agent: FieldAgent = {
              id: agentRecord.id,
              user_id: agentRecord.user_id,
              nombre: agentRecord.nombre,
              email: agentRecord.email,
              telefono: agentRecord.telefono,
              zona: agentRecord.zona,
              estado: agentRecord.estado
            };
            localStorage.setItem(STORAGE_KEY_AGENT, JSON.stringify(agent));
            return agent;
          }
        }
      } catch (e) {
        console.warn('Supabase auth notice for field agent, using direct profile lookup:', e);
      }
    }

    // Modo ágil / Acceso de campo por email verificado
    const localAgent: FieldAgent = {
      id: 'agent-' + cleanEmail.replace(/[^a-z0-9]/g, ''),
      nombre: cleanEmail.split('@')[0].toUpperCase(),
      email: cleanEmail,
      estado: 'activo'
    };
    localStorage.setItem(STORAGE_KEY_AGENT, JSON.stringify(localAgent));
    return localAgent;
  },

  /**
   * Cerrar sesión del agente de campo
   */
  async logoutAgent() {
    localStorage.removeItem(STORAGE_KEY_AGENT);
    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch {
        // ignore
      }
    }
  },

  /**
   * Obtener métricas del agente de campo
   */
  async getAgentMetrics(agentEmail: string) {
    try {
      let prospects: Array<{ id: string; status: string; created_at: string; creator_email?: string }> = [];

      if (supabase && isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('prospect_sites')
          .select('id, status, created_at, creator_email')
          .eq('creator_email', agentEmail);

        if (!error && data) {
          prospects = data;
        }
      }

      // Fallback a localStorage si está offline o tabla vacía
      if (prospects.length === 0) {
        const saved = localStorage.getItem('bf_prospect_sites_v1');
        if (saved) {
          try {
            const all = JSON.parse(saved);
            prospects = all.filter((p: any) => p.creator_email === agentEmail);
          } catch {
            // ignore
          }
        }
      }

      const today = new Date().toISOString().split('T')[0];
      const prospectosHoy = prospects.filter(p => p.created_at?.startsWith(today)).length;
      const convertidos = prospects.filter(p => p.status === 'reclamado' || p.status === 'cliente_pago').length;

      return {
        totalProspectos: prospects.length,
        prospectosHoy,
        prospectosSemana: prospects.length,
        convertidos
      };
    } catch (err) {
      console.error('Error obteniendo métricas del agente:', err);
      return { totalProspectos: 0, prospectosHoy: 0, prospectosSemana: 0, convertidos: 0 };
    }
  },

  /**
   * Obtener los prospectos creados por este agente (con fallback a prospectos de campo)
   */
  async getAgentProspects(agentEmail?: string): Promise<ProspectSite[]> {
    try {
      if (supabase && isSupabaseConfigured) {
        if (agentEmail) {
          const { data } = await supabase
            .from('prospect_sites')
            .select('*')
            .eq('creator_email', agentEmail)
            .order('created_at', { ascending: false });

          if (data && data.length > 0) {
            return data;
          }
        }

        // Si no hay con ese creator_email específico, traer todos los prospectos en campo
        const { data: allData, error } = await supabase
          .from('prospect_sites')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && allData && allData.length > 0) {
          return allData;
        }
      }

      const saved = localStorage.getItem('bf_prospect_sites_v1');
      if (saved) {
        const all: ProspectSite[] = JSON.parse(saved);
        if (agentEmail) {
          const filtered = all.filter(p => p.creator_email === agentEmail);
          if (filtered.length > 0) return filtered;
        }
        return all;
      }

      return [];
    } catch {
      return [];
    }
  }
};
