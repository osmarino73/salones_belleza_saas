import { createClient } from '@supabase/supabase-js';
import { Client, Stylist, Service, Appointment, ColorFormula, TenantAISettings, Product } from '../types';

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
    const aptWithTenant = { ...apt, tenant_id: tid };
    if (supabase && isSupabaseConfigured) {
      const { data, error } = await supabase.from('appointments').insert([aptWithTenant]).select().single();
      if (!error && data) return data as Appointment;
    }
    const current = await this.getAppointments(tid);
    const updated = [aptWithTenant, ...current];
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(updated));
    return aptWithTenant;
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
    if (supabase && isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('stylists')
        .select('*')
        .eq('tenant_id', tid)
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data as Stylist[];
    }
    const saved = localStorage.getItem(STORAGE_KEYS.STYLISTS);
    if (saved) {
      const list: Stylist[] = JSON.parse(saved);
      const filtered = list.filter(s => s.tenant_id === tid || !s.tenant_id);
      if (filtered.length > 0) return filtered;
    }
    return tid === '00000000-0000-0000-0000-000000000001' ? initialStylists : [];
  },

  async createStylist(stylist: Stylist): Promise<Stylist> {
    const tid = stylist.tenant_id || getActiveTenantId();
    const stylistWithTenant = { ...stylist, tenant_id: tid };
    if (supabase && isSupabaseConfigured) {
      const { data, error } = await supabase.from('stylists').insert([stylistWithTenant]).select().single();
      if (!error && data) return data as Stylist;
    }
    const current = await this.getStylists(tid);
    const updated = [stylistWithTenant, ...current];
    localStorage.setItem(STORAGE_KEYS.STYLISTS, JSON.stringify(updated));
    return stylistWithTenant;
  },

  async updateStylist(stylist: Stylist): Promise<Stylist> {
    if (supabase && isSupabaseConfigured) {
      const { data, error } = await supabase.from('stylists').update(stylist).eq('id', stylist.id).select().single();
      if (!error && data) return data as Stylist;
    }
    const current = await this.getStylists();
    const updated = current.map(s => s.id === stylist.id ? stylist : s);
    localStorage.setItem(STORAGE_KEYS.STYLISTS, JSON.stringify(updated));
    return stylist;
  },

  async deleteStylist(id: string): Promise<void> {
    if (supabase && isSupabaseConfigured) {
      await supabase.from('stylists').delete().eq('id', id);
    }
    const current = await this.getStylists();
    const updated = current.filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.STYLISTS, JSON.stringify(updated));
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
      if (!error && data && data.length > 0) return data as Service[];
    }
    const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
    if (saved) {
      const list: Service[] = JSON.parse(saved);
      const filtered = list.filter(s => s.tenant_id === tid || !s.tenant_id);
      if (filtered.length > 0) return filtered;
    }
    return tid === '00000000-0000-0000-0000-000000000001' ? initialServices : [];
  },

  async createService(service: Service): Promise<Service> {
    const tid = service.tenant_id || getActiveTenantId();
    const serviceWithTenant = { ...service, tenant_id: tid };
    if (supabase && isSupabaseConfigured) {
      const { data, error } = await supabase.from('services').insert([serviceWithTenant]).select().single();
      if (!error && data) return data as Service;
    }
    const current = await this.getServices(tid);
    const updated = [serviceWithTenant, ...current];
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(updated));
    return serviceWithTenant;
  },

  async updateService(service: Service): Promise<Service> {
    if (supabase && isSupabaseConfigured) {
      const { data, error } = await supabase.from('services').update(service).eq('id', service.id).select().single();
      if (!error && data) return data as Service;
    }
    const current = await this.getServices();
    const updated = current.map(s => s.id === service.id ? service : s);
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(updated));
    return service;
  },

  async deleteService(id: string): Promise<void> {
    if (supabase && isSupabaseConfigured) {
      await supabase.from('services').delete().eq('id', id);
    }
    const current = await this.getServices();
    const updated = current.filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(updated));
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
      return (import.meta as any).env?.VITE_ZERNIO_API_KEY || '';
    },
    getApiUrl(): string {
      return (import.meta as any).env?.VITE_ZERNIO_API_URL || 'https://api.zernio.com/v1';
    },
    async getConnectUrl(tenantId: string, platform: 'whatsapp' | 'instagram' = 'whatsapp') {
      const apiKey = this.getApiKey();
      const apiUrl = this.getApiUrl();
      if (apiKey) {
        try {
          const res = await fetch(`${apiUrl}/connect`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
              platform,
              tenant_id: tenantId,
              redirect_uri: window.location.origin + '/dashboard?connected=' + platform
            })
          });
          if (res.ok) {
            const data = await res.json();
            if (data.url || data.connect_url) return data.url || data.connect_url;
          }
        } catch (e) {
          console.warn('Zernio connect URL notice:', e);
        }
      }
      return `https://zernio.com/connect?platform=${platform}&tenant_id=${tenantId}&api_key=${apiKey || ''}`;
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
      if (supabase && isSupabaseConfigured) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          if (!error && data.user) {
            localStorage.setItem('bf_auth_user', JSON.stringify(data.user));
            return { user: data.user, session: data.session, error: null };
          }
          if (error) {
            console.warn('Supabase auth signIn notice:', error.message);
          }
        } catch (e: any) {
          console.warn('Supabase auth exception:', e.message);
        }
      }
      const localUser = {
        id: `usr-${Date.now()}`,
        email,
        user_metadata: { name: email.split('@')[0] },
        created_at: new Date().toISOString()
      };
      localStorage.setItem('bf_auth_user', JSON.stringify(localUser));
      return { user: localUser, session: { access_token: 'mock-token' }, error: null };
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
          role: 'owner',
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

    // 3. Insert into Supabase 'stylists' table (Owner as master stylist)
    const ownerStylistId = generateUUID();
    const ownerStylist: Stylist = {
      id: ownerStylistId,
      tenant_id: createdTenantId,
      name: params.owner.name,
      email: params.owner.email,
      phone: params.owner.phone || params.tenant.phone,
      specialty: 'Directora & Master Stylist',
      photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      rating: 5.0,
      reviews_count: 1,
      commission_service_pct: 50,
      commission_retail_pct: 10,
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
          specialty: ownerStylist.specialty,
          photo_url: ownerStylist.photo_url,
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


