import { createClient } from '@supabase/supabase-js';
import { Client, Stylist, Service, Appointment, ColorFormula, TenantAISettings, Product, ProspectSite, Tenant } from '../types';
import { KAPA_SPA_SITE_DATA } from './kapaSpaSiteData';

const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseUrl = rawSupabaseUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('mock')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Initial Local Storage Keys
const STORAGE_KEYS = {
  APPOINTMENTS: 'bf_appointments_v1',
  CLIENTS: 'bf_clients_v1',
  STYLISTS: 'bf_stylists_v1',
  SERVICES: 'bf_services_v1',
  PRODUCTS: 'bf_products_v1'
};

// Initial Seed Data
export const initialStylists: Stylist[] = [
  {
    id: 'sty-1',
    tenant_id: 'ten-1',
    name: 'Sofía Restrepo',
    email: 'sofia@studioglamour.co',
    phone: '3101234567',
    specialty: 'Master Colorista & Balayage',
    photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    rating: 4.9,
    reviews_count: 128,
    commission_service_pct: 45,
    commission_retail_pct: 10,
    working_days: [1, 2, 3, 4, 5, 6],
    service_categories: ['color', 'corte', 'keratina'],
    service_ids: ['srv-1', 'srv-2', 'srv-3'],
    is_active: true
  },
  {
    id: 'sty-2',
    tenant_id: 'ten-1',
    name: 'Carlos Morales',
    email: 'carlos@vargasbarber.co',
    phone: '3009876543',
    specialty: 'Estilista Capilar & Barber',
    photo_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
    rating: 4.8,
    reviews_count: 95,
    commission_service_pct: 45,
    commission_retail_pct: 10,
    working_days: [1, 2, 3, 4, 5, 6],
    service_categories: ['corte', 'barberia'],
    service_ids: ['srv-2'],
    is_active: true
  },
  {
    id: 'sty-3',
    tenant_id: 'ten-1',
    name: 'Laura Valencia',
    email: 'laura@valeriacolor.co',
    phone: '3205557890',
    specialty: 'Especialista en Nails & Spa',
    photo_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    rating: 5.0,
    reviews_count: 82,
    commission_service_pct: 50,
    commission_retail_pct: 10,
    working_days: [1, 2, 3, 4, 5, 6],
    service_categories: ['nails', 'spa'],
    service_ids: ['srv-4'],
    is_active: true
  }
];

export const initialServices: Service[] = [
  {
    id: 'srv-1',
    tenant_id: 'ten-1',
    name: 'Balayage Rubio Cenizo + Olaplex',
    category: 'color',
    duration_minutes: 120,
    price_usd: 110,
    requires_patch_test: true,
    description: 'Técnica a mano alzada, incluye matizado violeta, brushing y tratamiento protector Olaplex.'
  },
  {
    id: 'srv-2',
    tenant_id: 'ten-1',
    name: 'Corte Bob en Capas + Hidratación',
    category: 'corte',
    duration_minutes: 60,
    price_usd: 45,
    requires_patch_test: false,
    description: 'Diagnóstico de morfología facial, corte con tijera japonesa y mascarilla hidratante.'
  },
  {
    id: 'srv-3',
    tenant_id: 'ten-1',
    name: 'Keratina Orgánica Antifrizz',
    category: 'keratina',
    duration_minutes: 90,
    price_usd: 75,
    requires_patch_test: false,
    description: 'Alisado termoactivo sin formol, brillo espejo y control total de volumen por 4 meses.'
  },
  {
    id: 'srv-4',
    tenant_id: 'ten-1',
    name: 'Uñas Esculpidas en Poligel + Nail Art',
    category: 'nails',
    duration_minutes: 75,
    price_usd: 55,
    requires_patch_test: false,
    description: 'Manicura rusa combinada, extensión con molde y diseño personalizado a mano alzada.'
  }
];

export const initialClients: Client[] = [
  {
    id: 'cli-1',
    tenant_id: 'ten-1',
    full_name: 'María Fernanda López',
    phone_whatsapp: '+57 312 456 7890',
    email: 'maria@ejemplo.com',
    birthday: '1994-09-12',
    status: 'vip',
    total_spent_usd: 890,
    visits_count: 8,
    preferred_stylist_id: 'sty-1',
    allergies: 'Ninguna reportada. Prueba de parche OK.',
    last_visit_at: '2026-08-16',
    created_at: '2025-11-10',
    formulas: [
      {
        id: 'form-1',
        client_id: 'cli-1',
        stylist_id: 'sty-1',
        stylist_name: 'Sofía Restrepo',
        formula_text: 'L\'Oréal Majirel 7.1 (30g) + 8.2 (15g) con Oxidante 20 Vol (45ml) + Plex #1 (4ml)',
        developer_volume: '20 Vol',
        exposure_minutes: 38,
        plex_used: true,
        porosity_level: 'media',
        diagnostic_notes: 'Porosidad media en medios y puntas. Fondo de decoloración 8. Matizado violeta suave al enjuagar.',
        created_at: '2026-08-16'
      }
    ]
  },
  {
    id: 'cli-2',
    tenant_id: 'ten-1',
    full_name: 'Camila Mendoza',
    phone_whatsapp: '+57 310 889 4433',
    email: 'camila.mendoza@gmail.com',
    status: 'frecuente',
    total_spent_usd: 340,
    visits_count: 4,
    preferred_stylist_id: 'sty-1',
    last_visit_at: '2026-08-16',
    created_at: '2026-02-14',
    formulas: [
      {
        id: 'form-2',
        client_id: 'cli-2',
        stylist_id: 'sty-1',
        stylist_name: 'Sofía Restrepo',
        formula_text: 'Igora Royal 6.77 (40g) + 0.22 (5g) con Oxidante 10 Vol (45ml)',
        developer_volume: '10 Vol',
        exposure_minutes: 30,
        plex_used: false,
        porosity_level: 'baja',
        diagnostic_notes: 'Baño de color cobrizo natural sobre base castaño claro.',
        created_at: '2026-08-10'
      }
    ]
  },
  {
    id: 'cli-3',
    tenant_id: 'ten-1',
    full_name: 'Andrés Felipe Castro',
    phone_whatsapp: '+57 301 223 9988',
    status: 'frecuente',
    total_spent_usd: 210,
    visits_count: 5,
    preferred_stylist_id: 'sty-2',
    last_visit_at: '2026-08-16',
    created_at: '2026-03-01'
  }
];

export const initialAppointments: Appointment[] = [
  {
    id: 'cit-0082',
    tenant_id: 'ten-1',
    client_id: 'cli-1',
    client_name: 'María Fernanda López',
    client_phone: '+57 312 456 7890',
    stylist_id: 'sty-1',
    stylist_name: 'Sofía Restrepo',
    service_id: 'srv-1',
    service_name: 'Balayage Rubio Cenizo + Olaplex',
    date: '2026-08-18',
    time: '02:00 PM',
    duration_minutes: 120,
    price_usd: 110,
    status: 'en_atencion',
    wa_reminder_24h_sent: true,
    wa_reminder_2h_sent: true,
    created_at: '2026-08-17'
  },
  {
    id: 'cit-0083',
    tenant_id: 'ten-1',
    client_id: 'cli-2',
    client_name: 'Camila Mendoza',
    client_phone: '+57 310 889 4433',
    stylist_id: 'sty-1',
    stylist_name: 'Sofía Restrepo',
    service_id: 'srv-2',
    service_name: 'Corte Bob en Capas + Brushing',
    date: '2026-08-18',
    time: '04:30 PM',
    duration_minutes: 60,
    price_usd: 45,
    status: 'confirmada_wa',
    wa_reminder_24h_sent: true,
    wa_reminder_2h_sent: false,
    created_at: '2026-08-17'
  },
  {
    id: 'cit-0084',
    tenant_id: 'ten-1',
    client_id: 'cli-3',
    client_name: 'Andrés Felipe Castro',
    client_phone: '+57 301 223 9988',
    stylist_id: 'sty-2',
    stylist_name: 'Carlos Morales',
    service_id: 'srv-2',
    service_name: 'Fade Clásico + Ritual Barba',
    date: '2026-08-18',
    time: '02:30 PM',
    duration_minutes: 45,
    price_usd: 35,
    status: 'en_atencion',
    wa_reminder_24h_sent: true,
    wa_reminder_2h_sent: true,
    created_at: '2026-08-18'
  },
  {
    id: 'cit-0085',
    tenant_id: 'ten-1',
    client_id: 'cli-4',
    client_name: 'Valentina Restrepo',
    client_phone: '+57 315 776 2211',
    stylist_id: 'sty-3',
    stylist_name: 'Laura Valencia',
    service_id: 'srv-4',
    service_name: 'Uñas Esculpidas en Poligel',
    date: '2026-08-18',
    time: '05:00 PM',
    duration_minutes: 75,
    price_usd: 55,
    status: 'confirmada_wa',
    wa_reminder_24h_sent: true,
    wa_reminder_2h_sent: true,
    created_at: '2026-08-18'
  }
];

export function getActiveTenantId(): string {
  try {
    const raw = localStorage.getItem('bf_tenant_active');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.id) return parsed.id;
    }
  } catch (e) {}
  return '00000000-0000-0000-0000-000000000001';
}

// Cache en memoria para sitios pesados (>5MB con Base64) y evitar QuotaExceededError
let inMemoryProspectSitesCache: ProspectSite[] | null = null;

const safeSaveProspectSitesToLocalStorage = (sites: ProspectSite[]) => {
  try {
    // Si el HTML contiene imágenes Base64 pesadas (>150KB), guardar versión ligera en localStorage para no exceder cuota de 5MB
    const safeSites = sites.map(s => {
      if (s.raw_html && s.raw_html.length > 150000) {
        return {
          ...s,
          raw_html: s.raw_html.slice(0, 5000) + '<!-- heavy payload preserved in memory -->'
        };
      }
      return s;
    });
    localStorage.setItem('bf_prospect_sites_v1', JSON.stringify(safeSites));
  } catch (err) {
    console.warn('LocalStorage quota warning (safely stored in memory):', err);
  }
};

// Data API Helper functions (Supabase Live or Local fallback)
export const api = {
  // APPOINTMENTS
  async getAppointments(tenantId?: string): Promise<Appointment[]> {
    const tid = tenantId || getActiveTenantId();
    if (supabase && isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('tenant_id', tid)
        .order('date', { ascending: false });
      if (!error && data) return data as Appointment[];
    }
    const saved = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
    if (saved) {
      const list: Appointment[] = JSON.parse(saved);
      const filtered = list.filter(a => a.tenant_id === tid);
      if (filtered.length > 0) return filtered;
      if (tid !== '00000000-0000-0000-0000-000000000001') return [];
    }

    // Si es el tenant demo
    if (tid === '00000000-0000-0000-0000-000000000001') {
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(initialAppointments));
      return initialAppointments;
    }

    return [];
  },

  async createAppointment(apt: Appointment): Promise<Appointment> {
    const tid = apt.tenant_id || getActiveTenantId();
    const generateUUID = () => {
      if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
      }
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    };

    const isValidUUID = (str?: string) => {
      if (!str) return false;
      return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
    };

    const cleanAptId = isValidUUID(apt.id) ? apt.id : generateUUID();
    const cleanTenantId = isValidUUID(tid) ? tid : getActiveTenantId();
    const cleanStylistId = isValidUUID(apt.stylist_id) ? apt.stylist_id : null;
    const cleanServiceId = isValidUUID(apt.service_id) ? apt.service_id : null;
    const cleanClientId = isValidUUID(apt.client_id) ? apt.client_id : null;

    const aptPayload = {
      id: cleanAptId,
      tenant_id: cleanTenantId,
      client_id: cleanClientId,
      client_name: apt.client_name || 'Clienta',
      client_phone: apt.client_phone || '',
      stylist_id: cleanStylistId,
      stylist_name: apt.stylist_name || 'Especialista',
      service_id: cleanServiceId,
      service_name: apt.service_name || 'Servicio General',
      date: apt.date || new Date().toISOString().split('T')[0],
      time: apt.time || '02:00 PM',
      duration_minutes: apt.duration_minutes || 60,
      price_usd: Number(apt.price_usd || 0),
      status: apt.status || 'confirmada_wa',
      wa_reminder_24h_sent: true,
      wa_reminder_2h_sent: false
    };

    if (supabase && isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('appointments').insert([aptPayload]).select().single();
        if (error) {
          console.error('Error inserting appointment in Supabase:', error.message, error);
        } else if (data) {
          console.log('Appointment created successfully in Supabase:', data);
          return data as Appointment;
        }
      } catch (err) {
        console.error('Exception creating appointment in Supabase:', err);
      }
    }

    const current = await this.getAppointments(cleanTenantId);
    const updated = [aptPayload as Appointment, ...current];
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(updated));
    return aptPayload as Appointment;
  },

  async updateAppointmentStatus(id: string, status: Appointment['status']): Promise<void> {
    if (supabase && isSupabaseConfigured) {
      await supabase.from('appointments').update({ status }).eq('id', id);
    }
    const current = await this.getAppointments();
    const updated = current.map(a => a.id === id ? { ...a, status } : a);
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(updated));
  },

  // CLIENTS & COLOR FORMULAS
  async getClients(tenantId?: string): Promise<Client[]> {
    const tid = tenantId || getActiveTenantId();
    if (supabase && isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('clients')
        .select('*, formulas:color_formulas(*)')
        .eq('tenant_id', tid)
        .order('created_at', { ascending: false });
      if (!error && data) return data as Client[];
    }
    const saved = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    if (saved) {
      const list: Client[] = JSON.parse(saved);
      const filtered = list.filter(c => c.tenant_id === tid);
      if (filtered.length > 0) return filtered;
      if (tid !== '00000000-0000-0000-0000-000000000001') return [];
    }
    if (tid === '00000000-0000-0000-0000-000000000001') {
      localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(initialClients));
      return initialClients;
    }

    return [];
  },

  async createClient(client: Client): Promise<Client> {
    const tid = client.tenant_id || getActiveTenantId();
    const clientWithTenant = { ...client, tenant_id: tid };
    if (supabase && isSupabaseConfigured) {
      const { data, error } = await supabase.from('clients').insert([clientWithTenant]).select('*, formulas:color_formulas(*)').single();
      if (!error && data) return data as Client;
    }
    const current = await this.getClients(tid);
    const updated = [clientWithTenant, ...current];
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(updated));
    return clientWithTenant;
  },

  async updateClient(client: Client): Promise<Client> {
    if (supabase && isSupabaseConfigured) {
      const { data, error } = await supabase.from('clients').update(client).eq('id', client.id).select('*, formulas:color_formulas(*)').single();
      if (!error && data) return data as Client;
    }
    const current = await this.getClients();
    const updated = current.map(c => c.id === client.id ? client : c);
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(updated));
    return client;
  },

  async deleteClient(id: string): Promise<void> {
    if (supabase && isSupabaseConfigured) {
      await supabase.from('clients').delete().eq('id', id);
    }
    const current = await this.getClients();
    const updated = current.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(updated));
  },

  async addColorFormula(clientId: string, formula: ColorFormula): Promise<void> {
    if (supabase && isSupabaseConfigured) {
      await supabase.from('color_formulas').insert([formula]);
    }
    const current = await this.getClients();
    const updated = current.map(c => {
      if (c.id === clientId) {
        const existing = c.formulas || [];
        return { ...c, formulas: [formula, ...existing] };
      }
      return c;
    });
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(updated));
  },

  // STYLISTS
  async getStylists(tenantId?: string): Promise<Stylist[]> {
    const tid = tenantId || getActiveTenantId();

    const mapStylistFromDB = (d: any): Stylist => ({
      id: d.id,
      tenant_id: d.tenant_id,
      name: d.name,
      email: d.email || '',
      phone: d.phone || '',
      phone_whatsapp: d.phone || d.phone_whatsapp || '',
      role: d.role || (d.is_owner ? 'admin' : 'colaborador'),
      is_owner: d.is_owner || d.role === 'admin' || false,
      attends_clients: d.attends_clients !== false,
      specialty: d.specialty || 'Master Stylist',
      photo_url: d.photo_url || '',
      rating: Number(d.rating || 5.0),
      reviews_count: Number(d.reviews_count || 0),
      commission_service_pct: Number(d.service_commission_pct ?? d.commission_service_pct ?? 45),
      commission_retail_pct: Number(d.product_commission_pct ?? d.commission_retail_pct ?? 10),
      working_days: d.working_days || [1, 2, 3, 4, 5, 6],
      blocked_dates: d.blocked_dates || [],
      blocked_slots: d.blocked_slots || [],
      service_categories: d.service_categories || ['color', 'corte'],
      service_ids: d.service_ids || [],
      is_active: d.is_active !== false
    });

    if (supabase && isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('stylists')
          .select('*')
          .eq('tenant_id', tid)
          .order('created_at', { ascending: false });
        if (error) {
          console.warn('Notice reading stylists from Supabase:', error.message);
        } else if (data && data.length > 0) {
          return data.map(mapStylistFromDB);
        }
      } catch (e) {
        console.warn('Exception reading stylists from Supabase:', e);
      }
    }

    const saved = localStorage.getItem(STORAGE_KEYS.STYLISTS);
    if (saved) {
      const list: Stylist[] = JSON.parse(saved);
      const filtered = list.filter(s => s.tenant_id === tid);
      if (filtered.length > 0) return filtered;
    }
    return tid === '00000000-0000-0000-0000-000000000001' ? initialStylists : [];
  },

  async createStylist(stylist: Stylist, password?: string): Promise<Stylist> {
    const tid = stylist.tenant_id || getActiveTenantId();
    const generateUUID = () => {
      if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
      }
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    };

    const isValidUUID = (str?: string) => {
      if (!str) return false;
      return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
    };

    const cleanId = isValidUUID(stylist.id) ? stylist.id : generateUUID();
    const cleanTenantId = isValidUUID(tid) ? tid : getActiveTenantId();

    // 1. Crear usuario en Supabase Auth (auth.users)
    if (stylist.email && password) {
      try {
        const authRes = await this.auth.signUp(stylist.email, password, {
          name: stylist.name,
          role: stylist.role || 'colaborador',
          tenant_id: cleanTenantId
        });
        console.log(`Supabase Auth account registered for collaborator (${stylist.email}):`, authRes);
      } catch (authErr) {
        console.warn('Auth registration notice for collaborator:', authErr);
      }
    }

    const payload = {
      id: cleanId,
      tenant_id: cleanTenantId,
      name: stylist.name,
      email: stylist.email || null,
      phone: stylist.phone || stylist.phone_whatsapp || null,
      specialty: stylist.specialty || 'Master Stylist',
      photo_url: stylist.photo_url || null,
      service_commission_pct: Number(stylist.commission_service_pct ?? 45),
      product_commission_pct: Number(stylist.commission_retail_pct ?? 10),
      rating: Number(stylist.rating || 5.0),
      reviews_count: Number(stylist.reviews_count || 0),
      working_days: stylist.working_days || [1, 2, 3, 4, 5, 6],
      blocked_dates: stylist.blocked_dates || [],
      blocked_slots: stylist.blocked_slots || [],
      service_categories: stylist.service_categories || ['color', 'corte'],
      service_ids: stylist.service_ids || [],
      role: stylist.role || (stylist.is_owner ? 'admin' : 'colaborador'),
      is_owner: stylist.is_owner || stylist.role === 'admin' || false,
      attends_clients: stylist.attends_clients !== false,
      is_active: stylist.is_active !== false
    };

    const mapStylistFromDB = (d: any): Stylist => ({
      id: d.id,
      tenant_id: d.tenant_id,
      name: d.name,
      email: d.email || '',
      phone: d.phone || '',
      phone_whatsapp: d.phone || d.phone_whatsapp || '',
      role: d.role || (d.is_owner ? 'admin' : 'colaborador'),
      is_owner: d.is_owner || d.role === 'admin' || false,
      attends_clients: d.attends_clients !== false,
      specialty: d.specialty || 'Master Stylist',
      photo_url: d.photo_url || '',
      rating: Number(d.rating || 5.0),
      reviews_count: Number(d.reviews_count || 0),
      commission_service_pct: Number(d.service_commission_pct ?? d.commission_service_pct ?? 45),
      commission_retail_pct: Number(d.product_commission_pct ?? d.commission_retail_pct ?? 10),
      working_days: d.working_days || [1, 2, 3, 4, 5, 6],
      blocked_dates: d.blocked_dates || [],
      blocked_slots: d.blocked_slots || [],
      service_categories: d.service_categories || ['color', 'corte'],
      service_ids: d.service_ids || [],
      is_active: d.is_active !== false
    });

    if (supabase && isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('stylists').insert([payload]).select().single();
        if (error) {
          console.error('Error inserting stylist in Supabase:', error.message, error);
        } else if (data) {
          console.log('Stylist created successfully in Supabase:', data);
          const mapped = mapStylistFromDB(data);
          const current = await this.getStylists(cleanTenantId);
          const updated = [mapped, ...current.filter(s => s.id !== mapped.id)];
          localStorage.setItem(STORAGE_KEYS.STYLISTS, JSON.stringify(updated));
          return mapped;
        }
      } catch (e) {
        console.error('Exception inserting stylist in Supabase:', e);
      }
    }

    const localMapped = mapStylistFromDB(payload);
    const current = await this.getStylists(cleanTenantId);
    const updated = [localMapped, ...current.filter(s => s.id !== localMapped.id)];
    localStorage.setItem(STORAGE_KEYS.STYLISTS, JSON.stringify(updated));
    return localMapped;
  },

  async updateStylist(stylist: Stylist, password?: string): Promise<Stylist> {
    const tid = stylist.tenant_id || getActiveTenantId();

    // Si se especificó una nueva contraseña, registrar/actualizar en Supabase Auth
    if (stylist.email && password) {
      try {
        await this.auth.signUp(stylist.email, password, {
          name: stylist.name,
          role: stylist.role || 'colaborador',
          tenant_id: tid
        });
      } catch (authErr) {}
    }

    const payload = {
      id: stylist.id,
      tenant_id: tid,
      name: stylist.name,
      email: stylist.email || null,
      phone: stylist.phone || stylist.phone_whatsapp || null,
      specialty: stylist.specialty || 'Master Stylist',
      photo_url: stylist.photo_url || null,
      service_commission_pct: Number(stylist.commission_service_pct ?? 45),
      product_commission_pct: Number(stylist.commission_retail_pct ?? 10),
      rating: Number(stylist.rating || 5.0),
      reviews_count: Number(stylist.reviews_count || 0),
      working_days: stylist.working_days || [1, 2, 3, 4, 5, 6],
      blocked_dates: stylist.blocked_dates || [],
      blocked_slots: stylist.blocked_slots || [],
      service_categories: stylist.service_categories || ['color', 'corte'],
      service_ids: stylist.service_ids || [],
      role: stylist.role || (stylist.is_owner ? 'admin' : 'colaborador'),
      is_owner: stylist.is_owner || stylist.role === 'admin' || false,
      attends_clients: stylist.attends_clients !== false,
      is_active: stylist.is_active !== false
    };

    const mapStylistFromDB = (d: any): Stylist => ({
      id: d.id,
      tenant_id: d.tenant_id,
      name: d.name,
      email: d.email || '',
      phone: d.phone || '',
      phone_whatsapp: d.phone || d.phone_whatsapp || '',
      role: d.role || (d.is_owner ? 'admin' : 'colaborador'),
      is_owner: d.is_owner || d.role === 'admin' || false,
      attends_clients: d.attends_clients !== false,
      specialty: d.specialty || 'Master Stylist',
      photo_url: d.photo_url || '',
      rating: Number(d.rating || 5.0),
      reviews_count: Number(d.reviews_count || 0),
      commission_service_pct: Number(d.service_commission_pct ?? d.commission_service_pct ?? 45),
      commission_retail_pct: Number(d.product_commission_pct ?? d.commission_retail_pct ?? 10),
      working_days: d.working_days || [1, 2, 3, 4, 5, 6],
      blocked_dates: d.blocked_dates || [],
      blocked_slots: d.blocked_slots || [],
      service_categories: d.service_categories || ['color', 'corte'],
      service_ids: d.service_ids || [],
      is_active: d.is_active !== false
    });

    if (supabase && isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('stylists')
          .update(payload)
          .eq('id', stylist.id)
          .select()
          .single();
        if (error) {
          console.error('Error updating stylist in Supabase:', error.message, error);
        } else if (data) {
          console.log('Stylist updated successfully in Supabase:', data);
          const mapped = mapStylistFromDB(data);
          const current = await this.getStylists(tid);
          const updated = current.map(s => s.id === mapped.id ? mapped : s);
          localStorage.setItem(STORAGE_KEYS.STYLISTS, JSON.stringify(updated));
          return mapped;
        }
      } catch (e) {
        console.error('Exception updating stylist in Supabase:', e);
      }
    }

    const localMapped = mapStylistFromDB(payload);
    const current = await this.getStylists(tid);
    const updated = current.map(s => s.id === localMapped.id ? localMapped : s);
    localStorage.setItem(STORAGE_KEYS.STYLISTS, JSON.stringify(updated));
    return localMapped;
  },

  async deleteStylist(id: string): Promise<void> {
    const tid = getActiveTenantId();
    if (supabase && isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('stylists').delete().eq('id', id);
        if (error) console.error('Error deleting stylist in Supabase:', error.message);
      } catch (e) {}
    }
    const current = await this.getStylists(tid);
    const updated = current.filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.STYLISTS, JSON.stringify(updated));
  },

  async uploadAvatar(blob: Blob, fileName: string): Promise<string | null> {
    if (supabase && isSupabaseConfigured) {
      try {
        const filePath = `stylists/${Date.now()}_${fileName.replace(/[^a-zA-Z0-9._-]/g, '')}`;
        const { data, error } = await supabase.storage.from('avatars').upload(filePath, blob, {
          contentType: blob.type || 'image/webp',
          upsert: true
        });
        if (!error && data) {
          const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
          if (publicUrlData?.publicUrl) return publicUrlData.publicUrl;
        }
      } catch (err) {
        console.warn('Storage upload fallback to DataURL:', err);
      }
    }
    return null;
  },

  // SERVICES
  async getServices(tenantId?: string): Promise<Service[]> {
    const tid = tenantId || getActiveTenantId();
    if (supabase && isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('tenant_id', tid)
        .order('name', { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map((d: any) => {
          const p = Number(d.price ?? d.price_usd ?? d.price_cop ?? 0);
          return {
            ...d,
            price: p,
            price_usd: p,
            price_cop: p
          };
        }) as Service[];
      }
    }
    const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
    if (saved) {
      const list: any[] = JSON.parse(saved);
      const filtered = list.filter(s => s.tenant_id === tid);
      if (filtered.length > 0) {
        return filtered.map((d: any) => {
          const p = Number(d.price ?? d.price_usd ?? d.price_cop ?? 0);
          return {
            ...d,
            price: p,
            price_usd: p,
            price_cop: p
          };
        });
      }
    }
    return tid === '00000000-0000-0000-0000-000000000001' ? initialServices : [];
  },

  async createService(service: Service): Promise<Service> {
    const tid = service.tenant_id || getActiveTenantId();
    const priceValue = Number(service.price ?? service.price_usd ?? service.price_cop ?? 0);
    const serviceWithTenant = {
      ...service,
      tenant_id: tid,
      price: priceValue,
      price_usd: priceValue,
      price_cop: priceValue
    };
    if (supabase && isSupabaseConfigured) {
      const { data, error } = await supabase.from('services').insert([{
        id: serviceWithTenant.id,
        tenant_id: tid,
        name: serviceWithTenant.name,
        category: serviceWithTenant.category,
        price: priceValue,
        duration_minutes: serviceWithTenant.duration_minutes,
        requires_patch_test: serviceWithTenant.requires_patch_test,
        description: serviceWithTenant.description,
        is_active: true
      }]).select().single();
      if (!error && data) {
        const p = Number(data.price ?? priceValue);
        return {
          ...data,
          price: p,
          price_usd: p,
          price_cop: p
        } as Service;
      }
    }
    const current = await this.getServices(tid);
    const updated = [serviceWithTenant, ...current];
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(updated));
    return serviceWithTenant;
  },

  async updateService(service: Service): Promise<Service> {
    const priceValue = Number(service.price ?? service.price_usd ?? service.price_cop ?? 0);
    const normalized = {
      ...service,
      price: priceValue,
      price_usd: priceValue,
      price_cop: priceValue
    };
    if (supabase && isSupabaseConfigured) {
      const { data, error } = await supabase.from('services').update({
        name: normalized.name,
        category: normalized.category,
        price: priceValue,
        duration_minutes: normalized.duration_minutes,
        requires_patch_test: normalized.requires_patch_test,
        description: normalized.description
      }).eq('id', service.id).select().single();
      if (!error && data) {
        const p = Number(data.price ?? priceValue);
        return {
          ...data,
          price: p,
          price_usd: p,
          price_cop: p
        } as Service;
      }
    }
    const current = await this.getServices();
    const updated = current.map(s => s.id === service.id ? normalized : s);
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(updated));
    return normalized;
  },

  async deleteService(id: string): Promise<void> {
    if (supabase && isSupabaseConfigured) {
      await supabase.from('services').delete().eq('id', id);
    }
    const current = await this.getServices();
    const updated = current.filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(updated));
  },

  async getTenantBySlug(slug: string): Promise<any | null> {
    if (!slug) return null;
    const cleanSlug = slug.toLowerCase().trim();
    if (supabase && isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('tenants')
          .select('*')
          .or(`slug.ilike.${cleanSlug},slug.ilike.${cleanSlug}-%,slug.ilike.%${cleanSlug}%`)
          .limit(1)
          .maybeSingle();
        if (!error && data) return data;
      } catch (e) {}
    }
    const saved = localStorage.getItem('bf_tenant_active');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.slug && (parsed.slug.toLowerCase().includes(cleanSlug) || cleanSlug.includes(parsed.slug.toLowerCase()))) {
          return parsed;
        }
      } catch (e) {}
    }
    return null;
  },

  async getTenantByUserEmail(email: string): Promise<any | null> {
    if (!email) return null;
    const cleanEmail = email.toLowerCase().trim();
    if (supabase && isSupabaseConfigured) {
      try {
        // 1. Buscar estilista/dueña asociada en la tabla stylists
        const { data: styData } = await supabase
          .from('stylists')
          .select('tenant_id')
          .ilike('email', cleanEmail)
          .limit(1)
          .maybeSingle();

        if (styData && styData.tenant_id) {
          const { data: tenantData } = await supabase
            .from('tenants')
            .select('*')
            .eq('id', styData.tenant_id)
            .maybeSingle();
          if (tenantData) return tenantData;
        }

        // 2. Si no es la cuenta demo de Sofía, buscar el último tenant creado
        if (cleanEmail !== 'sofia@studioglamour.co') {
          const { data: latestTenant } = await supabase
            .from('tenants')
            .select('*')
            .neq('id', '00000000-0000-0000-0000-000000000001')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();
          if (latestTenant) return latestTenant;
        }
      } catch (e) {}
    }
    const saved = localStorage.getItem('bf_tenant_active');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return null;
  },

  // PRODUCTS
  async getProducts(tenantId?: string): Promise<Product[]> {
    const tid = tenantId || getActiveTenantId();
    if (supabase && isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('tenant_id', tid)
        .order('name', { ascending: true });
      if (!error && data && data.length > 0) return data as Product[];
    }
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (saved) {
      const list: Product[] = JSON.parse(saved);
      const filtered = list.filter(p => p.tenant_id === tid);
      if (filtered.length > 0) return filtered;
    }
    return tid === '00000000-0000-0000-0000-000000000001' ? initialProducts : [];
  },

  async createProduct(product: Product): Promise<Product> {
    const tid = product.tenant_id || getActiveTenantId();
    const prodWithTenant = { ...product, tenant_id: tid };
    if (supabase && isSupabaseConfigured) {
      const { data, error } = await supabase.from('products').insert([prodWithTenant]).select().single();
      if (!error && data) return data as Product;
    }
    const current = await this.getProducts(tid);
    const updated = [prodWithTenant, ...current];
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
    return prodWithTenant;
  },

  async updateProduct(product: Product): Promise<Product> {
    if (supabase && isSupabaseConfigured) {
      const { data, error } = await supabase.from('products').update(product).eq('id', product.id).select().single();
      if (!error && data) return data as Product;
    }
    const current = await this.getProducts();
    const updated = current.map(p => p.id === product.id ? product : p);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
    return product;
  },

  async deleteProduct(id: string): Promise<void> {
    if (supabase && isSupabaseConfigured) {
      await supabase.from('products').delete().eq('id', id);
    }
    const current = await this.getProducts();
    const updated = current.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
  },

  // TENANT AI SETTINGS
  async getTenantAISettings(tenantId?: string): Promise<TenantAISettings> {
    const tid = tenantId || getActiveTenantId();
    if (supabase && isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('tenant_ai_settings')
        .select('*')
        .eq('tenant_id', tid)
        .single();
      if (!error && data) return data as TenantAISettings;
    }
    const saved = localStorage.getItem('bf_tenant_ai_settings_v1');
    if (saved) {
      const s = JSON.parse(saved);
      if (s.tenant_id === tid || !s.tenant_id) return s;
    }
    return {
      ...initialTenantAISettings,
      tenant_id: tid
    };
  },

  async updateTenantAISettings(settings: Partial<TenantAISettings>): Promise<TenantAISettings> {
    const tid = settings.tenant_id || getActiveTenantId();
    const payload = { ...settings, tenant_id: tid, updated_at: new Date().toISOString() };
    if (supabase && isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('tenant_ai_settings')
        .upsert([payload])
        .select()
        .single();
      if (!error && data) return data as TenantAISettings;
    }
    const current = await this.getTenantAISettings(tid);
    const updated = { ...current, ...payload };
    localStorage.setItem('bf_tenant_ai_settings_v1', JSON.stringify(updated));
    return updated as TenantAISettings;
  },

  // =========================================================================
  // ZERNIO WHATSAPP GATEWAY
  // =========================================================================
  zernio: {
    getApiKey(): string {
      return (import.meta as any).env?.VITE_ZERNIO_API_KEY || 'sk_8bd2015375046ca83d922246133c3f60ac8d1da47d1539689947f1483dd37b51';
    },
    getApiUrl(): string {
      return (import.meta as any).env?.VITE_ZERNIO_API_URL || 'https://zernio.com/api/v1';
    },
    async getProfiles(): Promise<any[]> {
      const apiKey = this.getApiKey();
      try {
        const res = await fetch('https://zernio.com/api/v1/profiles', {
          headers: { 'Authorization': `Bearer ${apiKey}` }
        });
        if (res.ok) {
          const data = await res.json();
          return data.profiles || [];
        }
      } catch (e) {
        console.warn('Zernio getProfiles notice:', e);
      }
      return [{ _id: '69d3dea44a8b852e6db5b42f', name: 'Default' }];
    },
    async getAccounts(): Promise<any[]> {
      const apiKey = this.getApiKey();
      try {
        const res = await fetch('https://zernio.com/api/v1/accounts', {
          headers: { 'Authorization': `Bearer ${apiKey}` }
        });
        if (res.ok) {
          const data = await res.json();
          return data.accounts || [];
        }
      } catch (e) {
        console.warn('Zernio getAccounts error:', e);
      }
      return [];
    },
    async getConnectUrl(tenantId: string, platform: 'whatsapp' | 'instagram' = 'whatsapp'): Promise<string> {
      const apiKey = this.getApiKey();
      const redirectUri = encodeURIComponent(window.location.origin + '/dashboard?connected=' + platform);
      
      try {
        // 1. Obtener o resolver profileId de Zernio
        const profiles = await this.getProfiles();
        const profileId = profiles[0]?._id || '69d3dea44a8b852e6db5b42f';

        // 2. Llamada a Zernio Connect oficial con profileId
        const endpoint = `https://zernio.com/api/v1/connect/${platform}?profileId=${profileId}&redirect_url=${redirectUri}`;
        const res = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Accept': 'application/json'
          }
        });

        if (res.ok) {
          const data = await res.json();
          if (data.authUrl) {
            return data.authUrl;
          }
        }
      } catch (e) {
        console.warn('Zernio connect fetch error:', e);
      }
      
      // Fallback a URL directo de Facebook OAuth de Zernio si hay error de red
      return 'https://www.facebook.com/v22.0/dialog/oauth?client_id=712341431446535&redirect_uri=https%3A%2F%2Fzernio.com%2Fapi%2Fv1%2Fconnect%2Fwhatsapp%2Fcallback&scope=whatsapp_business_management%2Cwhatsapp_business_messaging%2Cwhatsapp_business_manage_events%2Cbusiness_management&response_type=code&config_id=920007930882314&override_default_response_type=true';
    },
    async createOrGetChannel(phone: string, tenantId: string) {
      const apiKey = this.getApiKey();
      const apiUrl = this.getApiUrl();
      if (apiKey) {
        try {
          const res = await fetch(`${apiUrl}/channels`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
              name: `Salon_${tenantId.slice(0, 8)}`,
              phone_number: phone,
              provider: 'whatsapp_coexistence',
              metadata: { tenant_id: tenantId }
            })
          });
          if (res.ok) {
            return await res.json();
          }
        } catch (e) {
          console.warn('Zernio API fetch notice:', e);
        }
      }
      return {
        id: `chn_zernio_${tenantId.slice(0, 8)}_${Date.now().toString(36)}`,
        status: 'active',
        phone_number: phone
      };
    },
    async checkChannelStatus(channelId: string) {
      const apiKey = this.getApiKey();
      const apiUrl = this.getApiUrl();
      if (apiKey) {
        try {
          const res = await fetch(`${apiUrl}/channels/${channelId}`, {
            headers: { 'Authorization': `Bearer ${apiKey}` }
          });
          if (res.ok) return await res.json();
        } catch (e) {}
      }
      return { id: channelId, status: 'connected' };
    }
  },

  // =========================================================================
  // AUTHENTICATION & BUSINESS ONBOARDING
  // =========================================================================
  auth: {
    async signUp(email: string, password: string, userData?: Record<string, any>) {
      if (supabase && isSupabaseConfigured) {
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: userData
            }
          });
          if (!error && data.user) {
            localStorage.setItem('bf_auth_user', JSON.stringify(data.user));
            return { user: data.user, session: data.session, error: null };
          }
          if (error) {
            console.warn('Supabase auth signUp notice:', error.message);
          }
        } catch (e: any) {
          console.warn('Supabase auth exception:', e.message);
        }
      }
      const localUser = {
        id: `usr-${Date.now()}`,
        email,
        user_metadata: userData || { name: 'Owner' },
        created_at: new Date().toISOString()
      };
      localStorage.setItem('bf_auth_user', JSON.stringify(localUser));
      return { user: localUser, session: { access_token: 'mock-token' }, error: null };
    },

    async signIn(email: string, password: string) {
      let loggedUser: any = null;
      if (supabase && isSupabaseConfigured) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          if (!error && data.user) {
            loggedUser = data.user;
          }
          if (error) {
            console.warn('Supabase auth signIn notice:', error.message);
          }
        } catch (e: any) {
          console.warn('Supabase auth exception:', e.message);
        }
      }

      if (!loggedUser) {
        loggedUser = {
          id: `usr-${Date.now()}`,
          email,
          user_metadata: { name: email.split('@')[0] },
          created_at: new Date().toISOString()
        };
      }

      localStorage.setItem('bf_auth_user', JSON.stringify(loggedUser));

      // Sincronizar automáticamente el tenant perteneciente a este usuario
      try {
        const tenant = await api.getTenantByUserEmail(email);
        if (tenant) {
          localStorage.setItem('bf_tenant_active', JSON.stringify(tenant));
        }
      } catch (tErr) {}

      return { user: loggedUser, session: { access_token: 'mock-token' }, error: null };
    },

    async signOut() {
      if (supabase && isSupabaseConfigured) {
        try {
          await supabase.auth.signOut();
        } catch (e) {}
      }
      localStorage.removeItem('bf_auth_user');
      localStorage.removeItem('bf_tenant_active');
    },

    getUser() {
      const saved = localStorage.getItem('bf_auth_user');
      return saved ? JSON.parse(saved) : null;
    }
  },

  async registerBusiness(params: {
    tenant: {
      name: string;
      slug: string;
      phone: string;
      whatsapp_number: string;
      currency?: string;
      address?: string;
      city?: string;
      country?: string;
      business_hours?: any;
    };
    owner: {
      name: string;
      email: string;
      password?: string;
      phone?: string;
      role?: 'admin' | 'colaborador';
      is_owner?: boolean;
      attends_clients?: boolean;
      specialty?: string;
      service_categories?: ('color' | 'corte' | 'keratina' | 'nails' | 'barberia' | 'spa')[];
    };
    services: Array<{
      name: string;
      category: string;
      duration_minutes: number;
      price: number;
      description?: string;
    }>;
    aiSettings: {
      agent_name: string;
      personality_tone: string;
      system_prompt_custom?: string;
      weekly_schedule?: any;
      cancellation_notice_hours?: number;
    };
  }) {
    const generateUUID = () => {
      if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
      }
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    };

    let createdTenantId = generateUUID();

    // 1. Supabase Auth Sign Up
    if (params.owner.email && params.owner.password) {
      try {
        const authRes = await this.auth.signUp(params.owner.email, params.owner.password, {
          name: params.owner.name,
          role: 'admin',
          is_owner: true,
          salon_name: params.tenant.name
        });
        console.log('Supabase Auth user created:', authRes);
      } catch (authErr) {
        console.warn('Auth notice:', authErr);
      }
    }

    // 2. Insert into Supabase 'tenants' table
    if (supabase && isSupabaseConfigured) {
      try {
        const tenantPayload = {
          id: createdTenantId,
          name: params.tenant.name,
          slug: `${params.tenant.slug}-${Date.now().toString().slice(-4)}`,
          phone: params.tenant.phone || params.tenant.whatsapp_number,
          whatsapp_number: params.tenant.whatsapp_number,
          currency: params.tenant.currency || 'COP',
          address: params.tenant.address || '',
          city: params.tenant.city || 'Medellín',
          country: params.tenant.country || 'Colombia',
          business_hours: params.tenant.business_hours || {},
          plan_tier: 'pro_ia',
          is_active: true
        };

        const { data: tData, error: tErr } = await supabase
          .from('tenants')
          .insert([tenantPayload])
          .select()
          .single();

        if (tErr) {
          console.error('Error inserting tenant in Supabase:', tErr.message, tErr);
        } else if (tData) {
          createdTenantId = tData.id;
          console.log('Tenant inserted successfully in Supabase:', tData);
        }
      } catch (e: any) {
        console.error('Exception inserting tenant:', e.message);
      }
    }

    // 3. Insert into Supabase 'stylists' table (Owner as Admin & Master Stylist)
    const ownerStylistId = generateUUID();
    const activeCategories = Array.from(new Set(params.services.map(s => s.category))) as any[];
    const ownerStylist: Stylist = {
      id: ownerStylistId,
      tenant_id: createdTenantId,
      name: params.owner.name,
      email: params.owner.email,
      phone: params.owner.phone || params.tenant.phone,
      role: 'admin',
      is_owner: true,
      attends_clients: params.owner.attends_clients !== false,
      specialty: params.owner.specialty || (params.owner.attends_clients !== false ? 'Dueña & Especialista Principal' : 'Administradora General'),
      photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      rating: 5.0,
      reviews_count: 1,
      commission_service_pct: 50,
      commission_retail_pct: 10,
      service_categories: params.owner.service_categories || activeCategories,
      is_active: true
    };

    if (supabase && isSupabaseConfigured) {
      try {
        const { error: sErr } = await supabase.from('stylists').insert([{
          id: ownerStylistId,
          tenant_id: createdTenantId,
          name: ownerStylist.name,
          email: ownerStylist.email,
          phone: ownerStylist.phone,
          role: 'admin',
          is_owner: true,
          attends_clients: ownerStylist.attends_clients,
          specialty: ownerStylist.specialty,
          photo_url: ownerStylist.photo_url,
          service_categories: ownerStylist.service_categories,
          service_commission_pct: 50,
          product_commission_pct: 10,
          is_active: true
        }]);
        if (sErr) console.error('Error inserting stylist:', sErr.message);
      } catch (e) {}
    }

    // 4. Insert into Supabase 'services' table
    const serviceEntities: Service[] = params.services.map((srv) => ({
      id: generateUUID(),
      tenant_id: createdTenantId,
      name: srv.name,
      category: srv.category as any,
      duration_minutes: srv.duration_minutes,
      price_usd: srv.price,
      requires_patch_test: srv.category === 'color' || srv.category === 'keratina',
      description: srv.description || `${srv.name} profesional`
    }));

    if (supabase && isSupabaseConfigured) {
      try {
        const payload = serviceEntities.map(s => ({
          id: s.id,
          tenant_id: createdTenantId,
          name: s.name,
          category: s.category,
          price: s.price_usd,
          duration_minutes: s.duration_minutes,
          requires_patch_test: s.requires_patch_test,
          description: s.description,
          is_active: true
        }));
        const { error: srvErr } = await supabase.from('services').insert(payload);
        if (srvErr) console.error('Error inserting services:', srvErr.message);
      } catch (e) {}
    }

    // 5. Insert into Supabase 'tenant_ai_settings'
    const aiSettingsPayload: TenantAISettings = {
      ...initialTenantAISettings,
      id: generateUUID(),
      tenant_id: createdTenantId,
      agent_name: params.aiSettings.agent_name,
      personality_tone: params.aiSettings.personality_tone as any,
      system_prompt_custom: params.aiSettings.system_prompt_custom || `Eres ${params.aiSettings.agent_name}, asistente de ${params.tenant.name}.`,
      business_bio: `${params.tenant.name}, salón en ${params.tenant.city || 'Medellín, Colombia'}.`,
      address_instructions: `${params.tenant.address || ''}, ${params.tenant.city || ''}`,
      cancellation_policy: `Mínimo ${params.aiSettings.cancellation_notice_hours || 4} horas de anticipación.`,
      whatsapp_phone_number: params.tenant.whatsapp_number,
      is_active: true
    };

    if (supabase && isSupabaseConfigured) {
      try {
        const { error: aiErr } = await supabase.from('tenant_ai_settings').insert([{
          id: aiSettingsPayload.id,
          tenant_id: createdTenantId,
          agent_name: aiSettingsPayload.agent_name,
          personality_tone: aiSettingsPayload.personality_tone,
          system_prompt_custom: aiSettingsPayload.system_prompt_custom,
          business_bio: aiSettingsPayload.business_bio,
          address_instructions: aiSettingsPayload.address_instructions,
          cancellation_policy: aiSettingsPayload.cancellation_policy,
          whatsapp_phone_number: aiSettingsPayload.whatsapp_phone_number,
          booking_enabled: true,
          send_reminder_whatsapp: true,
          reminder_hours_before: 2,
          is_active: true
        }]);
        if (aiErr) console.error('Error inserting tenant_ai_settings:', aiErr.message);
      } catch (e) {}
    }

    // 6. Save in Local Storage for seamless UX
    const activeTenantObj = {
      id: createdTenantId,
      name: params.tenant.name,
      slug: params.tenant.slug,
      phone: params.tenant.phone,
      whatsapp_number: params.tenant.whatsapp_number,
      address: params.tenant.address,
      city: params.tenant.city,
      country: params.tenant.country || 'Colombia',
      currency: params.tenant.currency || 'COP',
      business_hours: params.tenant.business_hours,
      plan: 'pro_ia',
      is_active: true,
      created_at: new Date().toISOString()
    };

    localStorage.setItem('bf_tenant_active', JSON.stringify(activeTenantObj));
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(serviceEntities));
    localStorage.setItem(STORAGE_KEYS.STYLISTS, JSON.stringify([ownerStylist]));
    localStorage.setItem('bf_tenant_ai_settings_v1', JSON.stringify(aiSettingsPayload));

    return {
      tenant: activeTenantObj,
      owner: ownerStylist,
      services: serviceEntities,
      aiSettings: aiSettingsPayload
    };
  },

  // =========================================================================
  // SUPERADMIN & SITIOS WEB GANCHO DE PROSPECCIÓN (LEAD ENGINE)
  // =========================================================================
  async getProspectSites(): Promise<ProspectSite[]> {
    if (supabase && isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('prospect_sites')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          inMemoryProspectSitesCache = data as ProspectSite[];
          safeSaveProspectSitesToLocalStorage(data as ProspectSite[]);
          return data as ProspectSite[];
        }
      } catch (e) {}
    }

    if (inMemoryProspectSitesCache && inMemoryProspectSitesCache.length > 0) {
      return inMemoryProspectSitesCache;
    }

    const saved = localStorage.getItem('bf_prospect_sites_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as ProspectSite[];
        const hasKapa = parsed.some(s => s.slug === 'kapa-spa');
        const merged = hasKapa ? parsed : [KAPA_SPA_SITE_DATA, ...parsed];
        inMemoryProspectSitesCache = merged;
        return merged;
      } catch (e) {}
    }

    // Datos Demo Iniciales (Kapa Spa Apartadó & Studio Glamour Spa Poblado)
    const demoSite: ProspectSite = {
      id: 'ps-demo-101',
      slug: 'studio-glamour-spa',
      business_name: 'Studio Glamour Spa',
      phone_whatsapp: '+573001234567',
      address: 'Calle 10 # 43E-22, El Poblado',
      city: 'Medellín',
      country: 'Colombia',
      google_maps_url: 'https://maps.google.com/?q=Studio+Glamour+Poblado',
      raw_html: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Studio Glamour Spa - Sitio Oficial</title>
  <style>
    body { font-family: sans-serif; background: #0B0F19; color: #fff; text-align: center; padding: 40px 20px; }
    .hero { max-width: 800px; margin: 0 auto; }
    h1 { font-size: 2.5rem; color: #FF5A36; }
    p { color: #94a3b8; font-size: 1.1rem; line-height: 1.6; }
    .services { display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; margin-top: 30px; }
    .card { background: #151c2e; padding: 20px; border-radius: 16px; border: 1px solid #1e293b; width: 250px; text-align: left; }
    .card h3 { margin-top: 0; color: #fff; font-size: 1.1rem; }
    .price { color: #10b981; font-weight: bold; font-size: 1.2rem; }
    .btn-wa { display: inline-block; background: #25D366; color: #fff; padding: 14px 28px; border-radius: 30px; text-decoration: none; font-weight: bold; margin-top: 20px; box-shadow: 0 10px 20px rgba(37,211,102,0.3); }
    .badge { background: #FF5A36/20; color: #FF5A36; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: bold; }
  </style>
</head>
<body>
  <div class="hero">
    <span class="badge">Salón & Spa Oficial</span>
    <h1>Studio Glamour Spa</h1>
    <p>Especialistas en estética capilar en El Poblado, Medellín.</p>
    <a href="https://wa.me/573001234567" class="btn-wa">💬 Escribir al WhatsApp</a>
  </div>
</body>
</html>`,
      category: 'salon',
      status: 'prospecto',
      views_count: 5,
      business_data: {
        nombre: 'Studio Glamour Spa',
        rubro: 'Salón de Belleza',
        contacto: {
          telefono_principal: '(300) 123-4567',
          whatsapp: { numero: '+573001234567', link: 'https://wa.me/573001234567' }
        },
        ubicacion: {
          direccion: 'Calle 10 # 43E-22, El Poblado',
          ciudad: 'Medellín',
          google_maps_url: 'https://maps.google.com/?q=Studio+Glamour+Poblado'
        },
        servicios: [
          { titulo: 'Balayage', descripcion: 'Colorimetría premium.', precio_cop: 280000, duracion_minutos: 120 }
        ],
        especialistas: [
          { nombre: 'Camila Master', rol: 'Master Colorista' },
          { nombre: 'Valentina Nails', rol: 'Especialista en Manicura Rusa' }
        ]
      },
      created_at: new Date().toISOString()
    };
    const defaultSites = [KAPA_SPA_SITE_DATA, demoSite];
    inMemoryProspectSitesCache = defaultSites;
    safeSaveProspectSitesToLocalStorage(defaultSites);
    return defaultSites;
  },

  async getProspectSiteBySlug(slug: string): Promise<ProspectSite | null> {
    if (supabase && isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('prospect_sites')
          .select('*')
          .eq('slug', slug)
          .single();
        if (!error && data) {
          const site = data as ProspectSite;
          if (inMemoryProspectSitesCache) {
            inMemoryProspectSitesCache = [site, ...inMemoryProspectSitesCache.filter(s => s.id !== site.id)];
          }
          return site;
        }
      } catch (e) {}
    }
    const sites = await this.getProspectSites();
    return sites.find(s => s.slug === slug || s.slug.toLowerCase() === slug.toLowerCase()) || null;
  },

  async createProspectSite(site: Partial<ProspectSite>): Promise<ProspectSite> {
    const isValidUUID = (str?: string) => str && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
    const generatedId = (typeof crypto !== 'undefined' && crypto.randomUUID) 
      ? crypto.randomUUID() 
      : '00000000-0000-4000-8000-' + Date.now().toString(16).padStart(12, '0').slice(-12);
    
    const targetId = isValidUUID(site.id) ? site.id! : generatedId;
    const targetSlug = (site.slug || site.business_name || 'salon')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const newSite: ProspectSite = {
      id: targetId,
      slug: targetSlug,
      business_name: site.business_name || 'Salón de Belleza',
      phone_whatsapp: site.phone_whatsapp || '+573000000000',
      address: site.address || '',
      city: site.city || 'Medellín',
      country: site.country || 'Colombia',
      google_maps_url: site.google_maps_url || '',
      raw_html: site.raw_html || '<h1>Bienvenido a nuestro Salón</h1>',
      category: site.category || 'salon',
      status: site.status || 'prospecto',
      business_data: site.business_data,
      views_count: site.views_count || 0,
      created_at: site.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (supabase && isSupabaseConfigured) {
      try {
        const { data: existing } = await supabase
          .from('prospect_sites')
          .select('id')
          .eq('slug', targetSlug)
          .maybeSingle();

        if (existing) {
          newSite.id = existing.id;
          await supabase
            .from('prospect_sites')
            .update({ ...newSite, id: existing.id })
            .eq('id', existing.id);
        } else {
          await supabase.from('prospect_sites').insert([newSite]);
        }
      } catch (e) {
        console.warn('Supabase prospect site notice (using in-memory & local cache):', e);
      }
    }

    const current = await this.getProspectSites();
    const updated = [newSite, ...current.filter(s => s.slug !== newSite.slug && s.id !== newSite.id)];
    inMemoryProspectSitesCache = updated;
    safeSaveProspectSitesToLocalStorage(updated);
    return newSite;
  },

  async updateProspectSite(id: string, siteData: Partial<ProspectSite>): Promise<ProspectSite | null> {
    if (supabase && isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('prospect_sites')
          .update({ ...siteData, updated_at: new Date().toISOString() })
          .eq('id', id);
        if (error) console.error('Error updating prospect site:', error.message);
      } catch (e) {}
    }
    const current = await this.getProspectSites();
    let updatedSite: ProspectSite | null = null;
    const updated = current.map(s => {
      if (s.id === id) {
        updatedSite = { ...s, ...siteData, updated_at: new Date().toISOString() };
        return updatedSite;
      }
      return s;
    });
    inMemoryProspectSitesCache = updated;
    safeSaveProspectSitesToLocalStorage(updated);
    return updatedSite;
  },

  async deleteProspectSite(id: string): Promise<boolean> {
    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('prospect_sites').delete().eq('id', id);
      } catch (e) {}
    }
    const current = await this.getProspectSites();
    const updated = current.filter(s => s.id !== id);
    inMemoryProspectSitesCache = updated;
    safeSaveProspectSitesToLocalStorage(updated);
    return true;
  },

  async incrementProspectSiteViews(id: string): Promise<void> {
    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.rpc('increment_prospect_views', { site_id: id });
      } catch (e) {}
    }
    const current = await this.getProspectSites();
    const updated = current.map(s => s.id === id ? { ...s, views_count: (s.views_count || 0) + 1 } : s);
    localStorage.setItem('bf_prospect_sites_v1', JSON.stringify(updated));
  },

  async getAllTenants(): Promise<Tenant[]> {
    if (supabase && isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('tenants')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data as Tenant[];
      } catch (e) {}
    }
    // Fallback demo tenant
    const activeTenantRaw = localStorage.getItem('bf_tenant_active');
    if (activeTenantRaw) {
      try {
        return [JSON.parse(activeTenantRaw) as Tenant];
      } catch (e) {}
    }
    return [{
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Studio Glamour Spa',
      slug: 'studio-glamour',
      phone: '+57 300 123 4567',
      address: 'Calle 10 # 43E-22, El Poblado',
      city: 'Medellín',
      country: 'Colombia',
      is_active: true,
      plan: 'pro_ai',
      owner_email: 'sofia@studioglamour.co',
      currency: 'COP',
      created_at: '2026-08-15'
    }];
  },

  async activateProspectAsTenant(params: {
    prospectId: string;
    ownerEmail: string;
    tempPassword?: string;
    businessName?: string;
    phoneWhatsapp?: string;
    currency?: 'COP' | 'USD' | 'MXN' | 'EUR';
    trialDays?: number;
  }): Promise<{ success: boolean; tenant: Tenant; tempPassword: string; error?: string }> {
    const prospectSites = await this.getProspectSites();
    const prospect = prospectSites.find(p => p.id === params.prospectId || p.slug === params.prospectId);

    const bName = params.businessName || prospect?.business_name || 'Salón & Spa';
    const wa = params.phoneWhatsapp || prospect?.phone_whatsapp || '+573000000000';
    const cleanSlug = (prospect?.slug || bName.toLowerCase().replace(/[^a-z0-9]/g, '-')).replace(/^-+|-+$/g, '');
    const tempPassword = params.tempPassword || (bName.replace(/\s+/g, '').slice(0, 5) + '2026*');
    const tenantCurrency = params.currency || 'COP';

    const generatedUUID = (typeof crypto !== 'undefined' && crypto.randomUUID) 
      ? crypto.randomUUID() 
      : '00000000-0000-4000-8000-' + Date.now().toString(16).padStart(12, '0').slice(-12);

    const trialDate = new Date();
    trialDate.setDate(trialDate.getDate() + (params.trialDays || 14));

    const newTenant: Tenant = {
      id: generatedUUID,
      name: bName,
      slug: cleanSlug,
      phone: wa,
      address: prospect?.address || '',
      city: prospect?.city || 'Medellín',
      country: prospect?.country || 'Colombia',
      is_active: true,
      plan: 'pro_ai',
      owner_email: params.ownerEmail.toLowerCase().trim(),
      currency: tenantCurrency,
      trial_ends_at: trialDate.toISOString(),
      business_hours: { summary: prospect?.business_data?.horario_atencion || 'Lun a Sáb: 8:00 AM – 7:00 PM' },
      created_at: new Date().toISOString()
    };

    // 1. Crear en Supabase Auth
    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.auth.signUp({
          email: params.ownerEmail.toLowerCase().trim(),
          password: tempPassword,
          options: {
            data: {
              name: bName + ' (Admin)',
              role: 'admin',
              tenant_id: newTenant.id,
              business_name: bName
            }
          }
        });
      } catch (e) {
        console.warn('Auth notice during tenant activation:', e);
      }

      // 2. Insertar en tabla tenants
      try {
        await supabase.from('tenants').insert([newTenant]);
      } catch (e) {
        console.warn('DB tenant insert notice:', e);
      }
    }

    // 3. Crear Dueña / Admin Stylist Profile
    const ownerStylist: Stylist = {
      id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : 'sty-owner-' + Date.now(),
      tenant_id: newTenant.id,
      name: bName + ' (Dueña / Admin)',
      email: params.ownerEmail.toLowerCase().trim(),
      phone: wa,
      specialty: 'Directora & Gestión General',
      photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      role: 'admin',
      is_owner: true,
      attends_clients: true,
      rating: 5.0,
      reviews_count: 0,
      commission_service_pct: 100,
      commission_retail_pct: 100,
      working_days: [1, 2, 3, 4, 5, 6],
      service_categories: ['spa', 'corte'],
      service_ids: [],
      is_active: true
    };
    await this.createStylist(ownerStylist, tempPassword);

    // 4. Migrar Especialistas reales de business_data
    const specialists = prospect?.business_data?.especialistas || [];
    for (let i = 0; i < specialists.length; i++) {
      const esp = specialists[i];
      const stylistId = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `sty-${Date.now()}-${i}`;
      const newSty: Stylist = {
        id: stylistId,
        tenant_id: newTenant.id,
        name: esp.nombre,
        email: `${esp.nombre.toLowerCase().replace(/[^a-z0-9]/g, '')}@${cleanSlug}.co`,
        phone: wa,
        specialty: esp.rol || 'Especialista',
        photo_url: esp.foto && !esp.foto.startsWith('assets/') ? esp.foto : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        role: 'colaborador',
        is_owner: false,
        attends_clients: true,
        rating: 5.0,
        reviews_count: 10,
        commission_service_pct: 45,
        commission_retail_pct: 10,
        working_days: [1, 2, 3, 4, 5, 6],
        service_categories: ['spa', 'corte'],
        service_ids: [],
        is_active: true
      };
      await this.createStylist(newSty, 'BeautyFlow2026*');
    }

    // 5. Migrar Servicios reales de business_data
    const services = prospect?.business_data?.servicios || [];
    for (let i = 0; i < services.length; i++) {
      const srv = services[i];
      const serviceId = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `srv-${Date.now()}-${i}`;
      const newSrv: Service = {
        id: serviceId,
        tenant_id: newTenant.id,
        name: srv.titulo,
        category: (prospect?.category === 'barberia' ? 'barberia' : prospect?.category === 'nails' ? 'nails' : 'spa'),
        duration_minutes: srv.duracion_minutos || 60,
        price_cop: srv.precio_cop || 90000,
        price_usd: srv.precio_cop ? Math.round(srv.precio_cop / 4000) : 30,
        price: srv.precio_cop || 90000,
        requires_patch_test: false,
        description: srv.descripcion || 'Servicio profesional garantizado.'
      };
      await this.createService(newSrv);
    }

    // 6. Actualizar prospect_sites como 'reclamado'
    if (prospect) {
      await this.updateProspectSite(prospect.id, {
        status: 'reclamado',
        claimed_tenant_id: newTenant.id
      });
    }

    // 7. Guardar en localStorage para disponibilidad inmediata
    localStorage.setItem('bf_tenant_active', JSON.stringify(newTenant));

    return {
      success: true,
      tenant: newTenant,
      tempPassword
    };
  }
};

export const initialTenantAISettings: TenantAISettings = {
  id: 'set-001',
  tenant_id: '00000000-0000-0000-0000-000000000001',
  agent_name: 'Flowy',
  personality_tone: 'elegante_calido',
  language: 'es',
  system_prompt_custom: 'Eres Flowy, la asesora virtual de belleza y agendamiento con IA de Luxe Hair & Spa Studio. Tu misión es brindar una bienvenida cálida, responder dudas de tarifas y confirmar citas con estilistas.',
  business_bio: 'Salón de belleza y estética capilar premium especializado en Balayage, Tratamientos Orgánicos, Uñas Esculpidas y Spa.',
  address_instructions: 'Calle 10 # 43E-22, El Poblado. Parqueadero privado gratis frente al local.',
  cancellation_policy: 'Puedes cancelar o reprogramar tu cita con al menos 4 horas de anticipación sin penalidad.',
  faqs: [
    { pregunta: '¿Aceptan mascotas?', respuesta: '¡Sí! Somos un espacio 100% Pet Friendly con agua y snacks para tu peludito.' },
    { pregunta: '¿Tienen parqueadero?', respuesta: 'Sí, contamos con 6 plazas de parqueadero exclusivo para clientas.' },
    { pregunta: '¿Qué métodos de pago reciben?', respuesta: 'Efectivo, tarjetas de crédito/débito, transferencias bancarias, Nequi y Daviplata.' }
  ],
  booking_enabled: true,
  requires_deposit: false,
  deposit_type: 'fixed',
  deposit_value: 15.00,
  payment_instructions: 'Para confirmar tu cita con abono, puedes transferir a Nequi / Bancolombia al 300 123 4567 y enviar el comprobante.',
  whatsapp_phone_number: '+57 300 123 4567',
  is_active: true,
  human_takeover_active: false,
  human_takeover_timeout_minutes: 120,
  send_reminder_whatsapp: true,
  reminder_hours_before: 2,
  reminder_custom_message: '✨ Te recordamos tu cita de belleza hoy a las {HORA} con {ESTILISTA} para tu {SERVICIO}. ¡Te esperamos con todo listo!',
  send_followup_review: true,
  followup_days_after: 1,
  google_maps_review_url: 'https://maps.google.com/?q=Luxe+Hair+Studio',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export const initialProducts: Product[] = [
  {
    id: 'prod-1',
    tenant_id: 'ten-1',
    name: 'Olaplex Nº 3 Hair Perfector',
    brand: 'Olaplex',
    category: 'Tratamiento',
    price_usd: 32.00,
    cost_price_usd: 18.00,
    stock_quantity: 14,
    min_stock_alert: 5,
    sku: 'OLA-003',
    created_at: '2026-01-15'
  },
  {
    id: 'prod-2',
    tenant_id: 'ten-1',
    name: 'Shampoo Matizador Violeta 300ml',
    brand: "L'Oréal Professionnel",
    category: 'Shampoo',
    price_usd: 24.00,
    cost_price_usd: 12.50,
    stock_quantity: 8,
    min_stock_alert: 4,
    sku: 'LOR-MAT-300',
    created_at: '2026-02-01'
  },
  {
    id: 'prod-3',
    tenant_id: 'ten-1',
    name: 'Óleo Reconstructor Elixir Ultime',
    brand: 'Kérastase',
    category: 'Óleo',
    price_usd: 48.00,
    cost_price_usd: 28.00,
    stock_quantity: 3,
    min_stock_alert: 5,
    sku: 'KER-ELX-100',
    created_at: '2026-02-20'
  },
  {
    id: 'prod-4',
    tenant_id: 'ten-1',
    name: 'Mascarilla Nutritiva Absolut Repair',
    brand: "L'Oréal Professionnel",
    category: 'Tratamiento',
    price_usd: 36.00,
    cost_price_usd: 20.00,
    stock_quantity: 12,
    min_stock_alert: 3,
    sku: 'LOR-ABS-250',
    created_at: '2026-03-10'
  }
];


