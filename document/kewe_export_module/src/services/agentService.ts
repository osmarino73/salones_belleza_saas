import { supabase } from '@/lib/supabase';
import { FieldAgent, ProspectSite } from '../types/keweBeauty';

export const agentService = {
  /**
   * Obtener sesión del agente autenticado en la vista de campo
   */
  async getCurrentAgent(): Promise<FieldAgent | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: agentRecord, error } = await supabase
        .from('agentes_campo')
        .select('*')
        .eq('user_id', user.id)
        .eq('estado', 'activo')
        .maybeSingle();

      if (error || !agentRecord) return null;

      return {
        id: agentRecord.id,
        user_id: agentRecord.user_id,
        nombre: agentRecord.nombre,
        email: agentRecord.email,
        telefono: agentRecord.telefono,
        estado: agentRecord.estado
      };
    } catch (err) {
      console.error('Error al obtener agente actual:', err);
      return null;
    }
  },

  /**
   * Obtener métricas del agente de campo (prospectos hoy, total y convertidos)
   */
  async getAgentMetrics(agentEmail: string) {
    try {
      const { data: prospects, error } = await supabase
        .from('prospect_sites')
        .select('id, status, created_at')
        .eq('creator_email', agentEmail);

      if (error || !prospects) {
        return { totalProspectos: 0, prospectosHoy: 0, prospectosSemana: 0, convertidos: 0 };
      }

      const today = new Date().toISOString().split('T')[0];
      const prospectosHoy = prospects.filter(p => p.created_at?.startsWith(today)).length;
      const convertidos = prospects.filter(p => p.status === 'reclamado' || p.status === 'cliente_pago').length;

      return {
        totalProspectos: prospects.length,
        prospectosHoy,
        prospectosSemana: prospects.length, // Puede calcularse con startOfWeek
        convertidos
      };
    } catch (err) {
      console.error('Error obteniendo métricas del agente:', err);
      return { totalProspectos: 0, prospectosHoy: 0, prospectosSemana: 0, convertidos: 0 };
    }
  },

  /**
   * Iniciar sesión del agente de campo
   */
  async loginAgent(email: string, password: string): Promise<FieldAgent> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) throw new Error(error?.message || 'Credenciales incorrectas');

    const agent = await this.getCurrentAgent();
    if (!agent) {
      await supabase.auth.signOut();
      throw new Error('Esta cuenta no tiene permisos de agente de campo o está inactiva.');
    }
    return agent;
  },

  /**
   * Cerrar sesión del agente
   */
  async logoutAgent() {
    await supabase.auth.signOut();
  }
};
