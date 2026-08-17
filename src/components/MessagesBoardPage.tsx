import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  MessageCircle,
  Search,
  Bot,
  User,
  Send,
  Sparkles,
  Phone,
  Calendar,
  Clock,
  Check,
  CheckCheck,
  Zap,
  Sliders,
  Play,
  Pause,
  AlertCircle,
  Star,
  Receipt,
  FileText,
  UserCheck,
  ChevronRight,
  RefreshCw,
  ExternalLink,
  Plus,
  Scissors,
  MapPin,
  Flame,
  ShieldCheck,
  CreditCard,
  Bell,
  Layers
} from 'lucide-react';
import { Client, Appointment, Stylist, Service, TenantAISettings } from '../types';

export interface ChatMessage {
  id: string;
  sender: 'client' | 'ai' | 'human_agent';
  senderName?: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  isHsmTemplate?: boolean;
  templateName?: string;
}

export interface ConversationThread {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientAvatar?: string;
  clientCategory: 'vip' | 'frecuente' | 'nuevo';
  unreadCount: number;
  lastMessageText: string;
  lastMessageTime: string;
  assignedStylistName?: string;
  hasUpcomingAppointment: boolean;
  appointmentDetails?: {
    serviceName: string;
    stylistName: string;
    date: string;
    time: string;
    status: string;
  };
  humanTakeoverActive: boolean;
  messages: ChatMessage[];
}

interface MessagesBoardPageProps {
  theme: 'light' | 'dark';
  salonName: string;
  salonPhone: string;
  salonEmail: string;
  aiSettings: TenantAISettings | null;
  clients: Client[];
  appointments: Appointment[];
  stylists: Stylist[];
  services: Service[];
  onOpenNewAppointment?: () => void;
  onOpenPosWithClient?: (client: Client) => void;
  onUpdateAiSettings?: (settings: Partial<TenantAISettings>) => void;
}

export const MessagesBoardPage: React.FC<MessagesBoardPageProps> = ({
  theme,
  salonName,
  salonPhone,
  salonEmail,
  aiSettings,
  clients,
  appointments,
  stylists,
  services,
  onOpenNewAppointment,
  onOpenPosWithClient,
  onUpdateAiSettings
}) => {
  const isDark = theme === 'dark';
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Tab: Real Live Inbox vs Sandbox Simulator
  const [boardMode, setBoardMode] = useState<'inbox' | 'sandbox'>('inbox');

  // Filter for Conversations
  const [filterType, setFilterType] = useState<'all' | 'ai' | 'human' | 'unread' | 'with_appointment'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Pre-configured Realistic Conversations Data
  const [threads, setThreads] = useState<ConversationThread[]>([
    {
      id: 'thread-1',
      clientId: 'cli-1',
      clientName: 'María Fernanda López',
      clientPhone: '+57 312 456 7890',
      clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      clientCategory: 'vip',
      unreadCount: 0,
      lastMessageText: '¡Perfecto! Te confirmo mi cita a las 02:00 PM con Sofía.',
      lastMessageTime: '11:42 AM',
      assignedStylistName: 'Sofía Restrepo',
      hasUpcomingAppointment: true,
      appointmentDetails: {
        serviceName: 'Balayage Rubio Cenizo + Olaplex',
        stylistName: 'Sofía Restrepo',
        date: 'Hoy',
        time: '02:00 PM',
        status: 'en_atencion'
      },
      humanTakeoverActive: false,
      messages: [
        {
          id: 'm-101',
          sender: 'client',
          text: 'Hola! Buenas tardes, me gustaría agendar para un Balayage con Sofía hoy o mañana.',
          timestamp: '11:38 AM',
          status: 'read'
        },
        {
          id: 'm-102',
          sender: 'ai',
          senderName: aiSettings?.agent_name || 'Flowy',
          text: '¡Hola María Fernanda! ✨ Qué alegría saludarte. Con gusto te ayudo. Sofía Restrepo tiene un espacio disponible hoy a las 02:00 PM para Balayage + Olaplex ($110 USD). ¿Te reservo ese horario?',
          timestamp: '11:39 AM',
          status: 'read'
        },
        {
          id: 'm-103',
          sender: 'client',
          text: '¡Perfecto! Te confirmo mi cita a las 02:00 PM con Sofía.',
          timestamp: '11:42 AM',
          status: 'read'
        },
        {
          id: 'm-104',
          sender: 'ai',
          senderName: aiSettings?.agent_name || 'Flowy',
          text: '🎉 ¡Cita confirmada con éxito! Quedaste agendada hoy a las 02:00 PM con Sofía Restrepo. Te esperamos en Carrera 43A # 1-50, El Poblado. ¡Será un gusto atenderte!',
          timestamp: '11:43 AM',
          status: 'read',
          isHsmTemplate: true,
          templateName: 'confirmacion_reserva_v2'
        }
      ]
    },
    {
      id: 'thread-2',
      clientId: 'cli-2',
      clientName: 'Camila Mendoza',
      clientPhone: '+57 310 889 4433',
      clientAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      clientCategory: 'frecuente',
      unreadCount: 1,
      lastMessageText: 'Hola, ¿tienen disponibilidad para corte Bob y mascarilla esta tarde?',
      lastMessageTime: '12:15 PM',
      assignedStylistName: 'Sofía Restrepo',
      hasUpcomingAppointment: true,
      appointmentDetails: {
        serviceName: 'Corte Bob en Capas + Brushing',
        stylistName: 'Sofía Restrepo',
        date: 'Hoy',
        time: '04:30 PM',
        status: 'confirmada_wa'
      },
      humanTakeoverActive: true,
      messages: [
        {
          id: 'm-201',
          sender: 'client',
          text: 'Hola, ¿tienen disponibilidad para corte Bob y mascarilla esta tarde?',
          timestamp: '12:15 PM',
          status: 'delivered'
        }
      ]
    },
    {
      id: 'thread-3',
      clientId: 'cli-3',
      clientName: 'Andrés Felipe Castro',
      clientPhone: '+57 301 223 9988',
      clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      clientCategory: 'frecuente',
      unreadCount: 0,
      lastMessageText: 'Voy en camino, llego en 10 minutos.',
      lastMessageTime: '01:50 PM',
      assignedStylistName: 'Carlos Morales',
      hasUpcomingAppointment: true,
      appointmentDetails: {
        serviceName: 'Fade Clásico + Ritual Barba',
        stylistName: 'Carlos Morales',
        date: 'Hoy',
        time: '02:30 PM',
        status: 'en_atencion'
      },
      messages: [
        {
          id: 'm-301',
          sender: 'ai',
          senderName: 'Flowy',
          text: '💈 ¡Hola Andrés! Te recordamos tu cita de Fade Clásico + Ritual Barba hoy a las 02:30 PM con Carlos Morales. ¿Confirmas asistencia?',
          timestamp: '12:30 PM',
          status: 'read',
          isHsmTemplate: true,
          templateName: 'recordatorio_2h_v2'
        },
        {
          id: 'm-302',
          sender: 'client',
          text: 'Confirmado. Voy en camino, llego en 10 minutos.',
          timestamp: '01:50 PM',
          status: 'read'
        }
      ],
      humanTakeoverActive: false
    },
    {
      id: 'thread-4',
      clientId: 'cli-4',
      clientName: 'Valentina Restrepo',
      clientPhone: '+57 315 776 2211',
      clientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      clientCategory: 'nuevo',
      unreadCount: 0,
      lastMessageText: '¿Cuál es el valor de las uñas esculpidas en poligel?',
      lastMessageTime: 'Ayer',
      assignedStylistName: 'Laura Valencia',
      hasUpcomingAppointment: true,
      appointmentDetails: {
        serviceName: 'Uñas Esculpidas en Poligel',
        stylistName: 'Laura Valencia',
        date: 'Hoy',
        time: '05:00 PM',
        status: 'confirmada_wa'
      },
      humanTakeoverActive: false,
      messages: [
        {
          id: 'm-401',
          sender: 'client',
          text: 'Hola! Buenas noches, ¿cuál es el valor de las uñas esculpidas en poligel con nail art?',
          timestamp: '07:15 PM',
          status: 'read'
        },
        {
          id: 'm-402',
          sender: 'ai',
          senderName: 'Flowy',
          text: '¡Hola Valentina! 💅 Nuestras Uñas Esculpidas en Poligel + Nail Art tienen un valor de $55 USD e incluyen manicura rusa combinada y diseño personalizado con Laura Valencia (duración 75 min). ¿Te gustaría agendar una cita?',
          timestamp: '07:16 PM',
          status: 'read'
        }
      ]
    },
    {
      id: 'thread-5',
      clientId: 'cli-5',
      clientName: 'Isabella Morales (Web Lead)',
      clientPhone: '+57 318 901 2345',
      clientCategory: 'nuevo',
      unreadCount: 2,
      lastMessageText: 'Hola, vi su página web y quiero preguntar por la Keratina Orgánica.',
      lastMessageTime: '10:05 AM',
      hasUpcomingAppointment: false,
      humanTakeoverActive: false,
      messages: [
        {
          id: 'm-501',
          sender: 'client',
          text: 'Hola, vi su página web y quiero preguntar por la Keratina Orgánica. ¿Tienen cupos para el sábado?',
          timestamp: '10:05 AM',
          status: 'delivered'
        },
        {
          id: 'm-502',
          sender: 'ai',
          senderName: 'Flowy',
          text: '¡Hola Isabella! 🌿 Qué gusto saludarte. Nuestra Keratina Orgánica Antifrizz es 100% libre de formol y deja un brillo espejo por 4 meses ($75 USD). Para este sábado tenemos cupos a las 10:00 AM y 03:00 PM. ¿Cuál horario te queda mejor?',
          timestamp: '10:06 AM',
          status: 'delivered'
        }
      ]
    }
  ]);

  // Selected Active Thread
  const [activeThreadId, setActiveThreadId] = useState<string>('thread-1');
  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0];

  // Message Input & Quick Replies Modal
  const [inputText, setInputText] = useState('');
  const [showQuickTemplates, setShowQuickTemplates] = useState(false);
  const [showQuickAnswers, setShowQuickAnswers] = useState(false);

  // Sandbox Simulator State
  const [sandboxMessages, setSandboxMessages] = useState<ChatMessage[]>([
    {
      id: 'sb-1',
      sender: 'client',
      text: 'Hola, ¿dónde están ubicados y qué precio tiene el Balayage?',
      timestamp: '02:00 PM',
      status: 'read'
    },
    {
      id: 'sb-2',
      sender: 'ai',
      senderName: aiSettings?.agent_name || 'Flowy',
      text: `¡Hola! ✨ Con gusto te informo. Estamos ubicados en ${aiSettings?.address_instructions || 'Carrera 43A # 1-50, El Poblado'}. Nuestro servicio de Balayage Rubio Cenizo + Olaplex tiene un valor de $110 USD e incluye matizado, brushing y protector capilar. ¿Deseas agendar tu cita?`,
      timestamp: '02:01 PM',
      status: 'read'
    }
  ]);
  const [sandboxInput, setSandboxInput] = useState('');
  const [isSandboxThinking, setIsSandboxThinking] = useState(false);

  // Auto scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeThread?.messages, sandboxMessages]);

  // Filtered threads list
  const filteredThreads = threads.filter(t => {
    const matchesSearch = 
      t.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.clientPhone.includes(searchQuery) ||
      t.lastMessageText.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === 'ai') return !t.humanTakeoverActive;
    if (filterType === 'human') return t.humanTakeoverActive;
    if (filterType === 'unread') return t.unreadCount > 0;
    if (filterType === 'with_appointment') return t.hasUpcomingAppointment;
    return true;
  });

  // Toggle Human Takeover
  const handleToggleTakeover = (threadId: string) => {
    setThreads(prev => prev.map(t => {
      if (t.id === threadId) {
        const nextState = !t.humanTakeoverActive;
        return {
          ...t,
          humanTakeoverActive: nextState,
          messages: [
            ...t.messages,
            {
              id: `sys-${Date.now()}`,
              sender: 'human_agent',
              senderName: 'Sistema',
              text: nextState
                ? '👤 Intervención humana activada. El Agente IA Flowy ha sido pausado para este chat.'
                : '🤖 Agente IA Flowy reanudado. Atendiendo automáticamente por WhatsApp.',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              status: 'read'
            }
          ]
        };
      }
      return t;
    }));
  };

  // Send Message in Active Conversation
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: activeThread.humanTakeoverActive ? 'human_agent' : 'ai',
      senderName: activeThread.humanTakeoverActive ? 'Operador Humano' : (aiSettings?.agent_name || 'Flowy'),
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setThreads(prev => prev.map(t => {
      if (t.id === activeThread.id) {
        return {
          ...t,
          unreadCount: 0,
          lastMessageText: newMsg.text,
          lastMessageTime: newMsg.timestamp,
          messages: [...t.messages, newMsg]
        };
      }
      return t;
    }));

    setInputText('');
    setShowQuickTemplates(false);
    setShowQuickAnswers(false);
  };

  // Send Pre-approved HSM Template
  const handleSendHsmTemplate = (title: string, templateText: string, templateKey: string) => {
    const newMsg: ChatMessage = {
      id: `hsm-${Date.now()}`,
      sender: 'ai',
      senderName: aiSettings?.agent_name || 'Flowy',
      text: templateText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
      isHsmTemplate: true,
      templateName: templateKey
    };

    setThreads(prev => prev.map(t => {
      if (t.id === activeThread.id) {
        return {
          ...t,
          unreadCount: 0,
          lastMessageText: `[Plantilla HSM] ${title}`,
          lastMessageTime: newMsg.timestamp,
          messages: [...t.messages, newMsg]
        };
      }
      return t;
    }));

    setShowQuickTemplates(false);
  };

  // Send Sandbox Message
  const handleSendSandbox = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!sandboxInput.trim()) return;

    const userText = sandboxInput.trim();
    const userMsg: ChatMessage = {
      id: `sb-u-${Date.now()}`,
      sender: 'client',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'read'
    };

    setSandboxMessages(prev => [...prev, userMsg]);
    setSandboxInput('');
    setIsSandboxThinking(true);

    // Simulate AI response with salon context
    setTimeout(() => {
      let aiReply = `¡Hola! Gracias por escribirnos a ${salonName}. `;
      const lower = userText.toLowerCase();

      if (lower.includes('precio') || lower.includes('costo') || lower.includes('tarifa') || lower.includes('cuanto')) {
        aiReply += `Nuestros servicios más solicitados son: Balayage Rubio Cenizo ($110 USD), Keratina Orgánica ($75 USD), Corte Bob ($45 USD) y Uñas Poligel ($55 USD). ¿Te gustaría agendar alguno?`;
      } else if (lower.includes('donde') || lower.includes('ubicacion') || lower.includes('direccion') || lower.includes('parqueadero')) {
        aiReply += `Estamos ubicados en ${aiSettings?.address_instructions || 'Carrera 43A # 1-50, El Poblado'}. Contamos con parqueadero gratuito para clientes.`;
      } else if (lower.includes('cita') || lower.includes('agendar') || lower.includes('reservar') || lower.includes('hora') || lower.includes('cupo')) {
        aiReply += `¡Con gusto! Para agendar tu cita, dime por favor qué servicio deseas realizarte y si tienes algún estilista preferido (Sofía, Carlos o Laura).`;
      } else if (lower.includes('mascota') || lower.includes('pet')) {
        aiReply += `¡Por supuesto! Somos un salón 100% Pet Friendly con agua fresca y snacks para tu mascota. 🐾`;
      } else {
        aiReply += `Estoy aquí para ayudarte con agendamientos, preguntas sobre servicios de colorimetría, corte, estética capilar y horarios de atención. ¿En qué te puedo asesorar hoy?`;
      }

      const aiMsg: ChatMessage = {
        id: `sb-a-${Date.now()}`,
        sender: 'ai',
        senderName: aiSettings?.agent_name || 'Flowy',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read'
      };

      setSandboxMessages(prev => [...prev, aiMsg]);
      setIsSandboxThinking(false);
    }, 1100);
  };

  // Predefined Quick Answers for Salon Reception
  const quickAnswersList = [
    {
      title: '📍 Ubicación & Parqueadero',
      text: `Estamos ubicados en ${aiSettings?.address_instructions || 'Carrera 43A # 1-50, El Poblado'}. Contamos con parqueadero gratuito y zona Pet Friendly.`
    },
    {
      title: '💳 Métodos de Pago',
      text: 'Aceptamos transferencias bancarias, Nequi, Daviplata, tarjetas de crédito/débito y efectivo.'
    },
    {
      title: '⏰ Políticas de Cancelación',
      text: aiSettings?.cancellation_policy || 'Puedes cancelar o reprogramar tu cita con al menos 4 horas de anticipación sin penalidad.'
    },
    {
      title: '🎨 Preparación para Colorimetría / Balayage',
      text: 'Te recomendamos venir con el cabello lavado de 24 horas antes, sin aceites pesados y disponer de aproximadamente 2 a 3 horas para un acabado perfecto.'
    }
  ];

  // Predefined HSM Templates List
  const quickHsmTemplatesList = [
    {
      title: '✅ Confirmación Inmediata de Reserva',
      key: 'confirmacion_reserva_v2',
      text: `✨ ¡Hola ${activeThread.clientName.split(' ')[0]}! Tu cita en ${salonName} para ${activeThread.appointmentDetails?.serviceName || 'Servicio de Belleza'} está confirmada para ${activeThread.appointmentDetails?.date || 'Hoy'} a las ${activeThread.appointmentDetails?.time || '02:00 PM'} con ${activeThread.appointmentDetails?.stylistName || 'tu especialista'}. ¡Te esperamos!`
    },
    {
      title: '⏰ Recordatorio 24 Horas Antes',
      key: 'recordatorio_24h_v2',
      text: `🌸 Hola ${activeThread.clientName.split(' ')[0]}, te recordamos tu cita de mañana a las ${activeThread.appointmentDetails?.time || '02:00 PM'} con ${activeThread.appointmentDetails?.stylistName || 'tu estilista'}. ¿Confirmas tu asistencia? Responde SI para confirmar o REPROGRAMAR.`
    },
    {
      title: '🚗 Alerta 2 Horas Antes ("En Camino")',
      key: 'recordatorio_2h_v2',
      text: `⏳ ¡Hola ${activeThread.clientName.split(' ')[0]}! Tu especialista te espera en 2 horas en ${salonName}. Dirección: Carrera 43A # 1-50, El Poblado. ¡Buen viaje!`
    },
    {
      title: '⭐ Solicitud de Reseña en Google Maps',
      key: 'encuesta_satisfaccion_v2',
      text: `💖 ¡Hola ${activeThread.clientName.split(' ')[0]}! Esperamos que hayas amado tu experiencia en ${salonName}. Si nos regalas 5 estrellas en Google Maps, recibirás un 15% de descuento en tu próxima visita.`
    }
  ];

  const totalUnread = threads.reduce((acc, t) => acc + t.unreadCount, 0);
  const totalAiActive = threads.filter(t => !t.humanTakeoverActive).length;
  const totalHumanActive = threads.filter(t => t.humanTakeoverActive).length;
  const totalWithAppointment = threads.filter(t => t.hasUpcomingAppointment).length;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* ========================================================================= */}
      {/* 1. TOP MINIMALIST ACTION & METRICS TOOLBAR */}
      {/* ========================================================================= */}
      <div className={`p-3.5 sm:p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
        isDark ? 'bg-[#121622] border-white/10' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        
        {/* Left: Title + Live Badge + Inline Quick Stats */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 text-black flex items-center justify-center font-bold shadow-sm">
              <MessageSquare className="w-4 h-4" />
            </div>
            <strong className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Mensajes & WhatsApp
            </strong>
          </div>

          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            Meta API
          </span>

          <div className={`hidden md:flex items-center gap-2 text-xs border-l pl-3 ${
            isDark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'
          }`}>
            <span><strong>{threads.length}</strong> chats</span>
            <span>•</span>
            <span className="text-emerald-500 font-semibold"><strong>{totalAiActive}</strong> con IA</span>
            <span>•</span>
            <span className="text-amber-500 font-semibold"><strong>{totalHumanActive}</strong> humano</span>
            <span>•</span>
            <span className="text-cyan-500 font-semibold"><strong>{totalWithAppointment}</strong> citas</span>
          </div>
        </div>

        {/* Right: Master Bot Switch + Compact View Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          
          {/* Master Bot Active / Paused Switch */}
          <button
            type="button"
            onClick={() => {
              if (onUpdateAiSettings) {
                onUpdateAiSettings({ is_active: !(aiSettings?.is_active ?? true) });
              }
            }}
            className={`text-xs font-extrabold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all shadow-sm cursor-pointer ${
              (aiSettings?.is_active ?? true)
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25'
                : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/25'
            }`}
            title="Activar o pausar la atención automática del Bot IA para todo el salón"
          >
            <span className={`w-2 h-2 rounded-full ${
              (aiSettings?.is_active ?? true) ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
            }`} />
            <Bot className="w-3.5 h-3.5" />
            <span>{(aiSettings?.is_active ?? true) ? 'Bot IA: Activo' : 'Bot IA: Pausado'}</span>
          </button>

          <div className={`p-1 rounded-xl border flex items-center gap-1 shrink-0 ${
            isDark ? 'bg-[#0B0E14] border-white/10' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              type="button"
              onClick={() => setBoardMode('inbox')}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                boardMode === 'inbox'
                  ? 'bg-emerald-500 text-black shadow-sm'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Bandeja ({threads.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setBoardMode('sandbox')}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                boardMode === 'sandbox'
                  ? 'bg-amber-500 text-black shadow-sm'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulador Sandbox</span>
            </button>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. TABLERO DE BANDEJA EN VIVO (3-COLUMN SPLIT SCREEN) */}
      {/* ========================================================================= */}
      {boardMode === 'inbox' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* ======================================================================= */}
          {/* COLUMNA 1: SIDEBAR DE CONVERSACIONES (4 COLS) */}
          {/* ======================================================================= */}
          <div className="lg:col-span-4 space-y-4">
            <div className={`p-4 sm:p-5 rounded-3xl border space-y-4 shadow-lg ${
              isDark ? 'bg-[#121622] border-white/10' : 'bg-white border-slate-200'
            }`}>
              
              {/* Search Bar */}
              <div className="relative">
                <Search className={`w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar clienta o teléfono..."
                  className={`w-full pl-9 pr-3.5 py-2.5 rounded-2xl text-xs focus:outline-none focus:border-emerald-500 transition-all ${
                    isDark 
                      ? 'bg-[#0B0E14] border border-white/10 text-white placeholder-slate-500' 
                      : 'bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>

              {/* Segmented Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                {[
                  { id: 'all', label: 'Todos' },
                  { id: 'ai', label: '🤖 IA Activa' },
                  { id: 'human', label: '👤 Humano' },
                  { id: 'with_appointment', label: '📅 Con Cita' }
                ].map((flt) => (
                  <button
                    key={flt.id}
                    type="button"
                    onClick={() => setFilterType(flt.id as any)}
                    className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer ${
                      filterType === flt.id
                        ? 'bg-emerald-500 text-black shadow-sm'
                        : isDark
                          ? 'bg-white/5 hover:bg-white/10 text-slate-300'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {flt.label}
                  </button>
                ))}
              </div>

              {/* Conversations List */}
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {filteredThreads.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    No se encontraron conversaciones con ese filtro.
                  </div>
                ) : (
                  filteredThreads.map((thr) => {
                    const isSelected = thr.id === activeThread.id;

                    return (
                      <div
                        key={thr.id}
                        onClick={() => {
                          setActiveThreadId(thr.id);
                          setThreads(prev => prev.map(t => t.id === thr.id ? { ...t, unreadCount: 0 } : t));
                        }}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative ${
                          isSelected
                            ? isDark
                              ? 'bg-emerald-500/10 border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                              : 'bg-emerald-50/80 border-emerald-300 shadow-md'
                            : isDark
                              ? 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/15'
                              : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Client Avatar / Initial */}
                          <div className="relative shrink-0">
                            {thr.clientAvatar ? (
                              <img
                                src={thr.clientAvatar}
                                alt={thr.clientName}
                                className="w-10 h-10 rounded-2xl object-cover border border-black/10 dark:border-white/10 shadow-sm"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF5A36] to-pink-500 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                                {thr.clientName.charAt(0)}
                              </div>
                            )}

                            {/* Status Indicator Dot on Avatar */}
                            <span className={`w-3 h-3 rounded-full border-2 absolute -bottom-0.5 -right-0.5 ${
                              isDark ? 'border-[#121622]' : 'border-white'
                            } ${
                              thr.humanTakeoverActive ? 'bg-amber-500' : 'bg-emerald-500'
                            }`} title={thr.humanTakeoverActive ? 'Intervención humana activa' : 'Atendido por IA Flowy'} />
                          </div>

                          {/* Client Info & Last Message Snippet */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1 mb-0.5">
                              <strong className={`text-xs font-bold truncate ${
                                isSelected
                                  ? isDark ? 'text-emerald-400' : 'text-emerald-800'
                                  : isDark ? 'text-white' : 'text-slate-900'
                              }`}>
                                {thr.clientName}
                              </strong>
                              <span className={`text-[10px] shrink-0 ${
                                isDark ? 'text-slate-400' : 'text-slate-500'
                              }`}>
                                {thr.lastMessageTime}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 mb-1.5">
                              {thr.clientCategory === 'vip' && (
                                <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 uppercase">
                                  VIP
                                </span>
                              )}
                              <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded flex items-center gap-1 ${
                                thr.humanTakeoverActive
                                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                  : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              }`}>
                                {thr.humanTakeoverActive ? <User className="w-2.5 h-2.5" /> : <Bot className="w-2.5 h-2.5" />}
                                <span>{thr.humanTakeoverActive ? 'Humano' : 'Flowy IA'}</span>
                              </span>
                            </div>

                            <p className={`text-[11px] truncate leading-tight ${
                              thr.unreadCount > 0
                                ? isDark ? 'text-white font-bold' : 'text-slate-900 font-bold'
                                : isDark ? 'text-slate-400' : 'text-slate-600'
                            }`}>
                              {thr.lastMessageText}
                            </p>
                          </div>

                          {/* Unread Badge */}
                          {thr.unreadCount > 0 && (
                            <span className="w-5 h-5 rounded-full bg-emerald-500 text-black font-extrabold text-[10px] flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/30">
                              {thr.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* ======================================================================= */}
          {/* COLUMNA 2: CHAT ACTIVO & OPERACIONES EN VIVO (5 COLS) */}
          {/* ======================================================================= */}
          <div className="lg:col-span-5 space-y-4">
            <div className={`p-5 rounded-3xl border flex flex-col h-[680px] shadow-xl ${
              isDark ? 'bg-[#121622] border-white/10' : 'bg-white border-slate-200'
            }`}>
              
              {/* Active Chat Header */}
              <div className={`flex items-center justify-between pb-3.5 border-b shrink-0 ${
                isDark ? 'border-white/10' : 'border-slate-100'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-black font-bold flex items-center justify-center shadow-md shadow-emerald-500/20">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className={`text-xs sm:text-sm font-bold ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}>
                        {activeThread.clientName}
                      </strong>
                      <span className="text-[10px] font-mono text-slate-400">
                        {activeThread.clientPhone}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Canal WhatsApp Oficial • En Línea
                    </span>
                  </div>
                </div>

                {/* Human Takeover Toggle Button */}
                <button
                  type="button"
                  onClick={() => handleToggleTakeover(activeThread.id)}
                  className={`text-xs font-extrabold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all shadow-sm cursor-pointer ${
                    activeThread.humanTakeoverActive
                      ? 'bg-amber-500 text-black border-amber-400 shadow-amber-500/20'
                      : isDark
                        ? 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                  }`}
                  title={activeThread.humanTakeoverActive ? 'Reanudar Agente IA Flowy' : 'Pausar IA y tomar control manual'}
                >
                  {activeThread.humanTakeoverActive ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-current" />
                      <span>Modo Humano</span>
                    </>
                  ) : (
                    <>
                      <Bot className="w-3.5 h-3.5" />
                      <span>Flowy IA</span>
                    </>
                  )}
                </button>
              </div>

              {/* Chat Messages Body */}
              <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-3.5 pr-2 my-2">
                {activeThread.messages.map((msg) => {
                  const isClient = msg.sender === 'client';
                  const isHuman = msg.sender === 'human_agent';

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isClient ? 'items-start' : 'items-end'}`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm relative ${
                          isClient
                            ? isDark 
                              ? 'bg-[#1A2030] text-slate-100 border border-white/5 rounded-tl-sm' 
                              : 'bg-slate-100 text-slate-900 border border-slate-200 rounded-tl-sm'
                            : isHuman
                              ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-tr-sm'
                              : 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-tr-sm'
                        }`}
                      >
                        {/* Sender Label & Badge */}
                        {!isClient && (
                          <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-white/15">
                            <span className="text-[10px] font-extrabold flex items-center gap-1 opacity-90">
                              {isHuman ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                              <span>{msg.senderName || (isHuman ? 'Operador Humano' : 'Flowy IA')}</span>
                            </span>
                            {msg.isHsmTemplate && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-black/20 text-emerald-200 uppercase">
                                Plantilla HSM
                              </span>
                            )}
                          </div>
                        )}

                        {/* Text */}
                        <p className="whitespace-pre-wrap">{msg.text}</p>

                        {/* Timestamp & Delivery Checks */}
                        <div className="flex items-center justify-end gap-1 mt-1 text-[9px] opacity-70">
                          <span>{msg.timestamp}</span>
                          {!isClient && (
                            <CheckCheck className="w-3 h-3 text-emerald-300" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions Bar (HSM Templates & Quick Answers Popups) */}
              <div className="relative pt-2 shrink-0 border-t border-black/5 dark:border-white/10">
                
                {/* Popover: Quick HSM Templates */}
                {showQuickTemplates && (
                  <div className={`absolute bottom-16 left-0 right-0 p-4 rounded-2xl border shadow-2xl z-30 space-y-2 animate-fade-in ${
                    isDark ? 'bg-[#141926] border-emerald-500/30' : 'bg-white border-emerald-300'
                  }`}>
                    <div className="flex items-center justify-between border-b pb-2 border-black/5 dark:border-white/10">
                      <strong className={`text-xs font-bold flex items-center gap-1.5 ${
                        isDark ? 'text-emerald-400' : 'text-emerald-700'
                      }`}>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Insertar Plantilla Oficial WhatsApp (Meta HSM)</span>
                      </strong>
                      <button
                        type="button"
                        onClick={() => setShowQuickTemplates(false)}
                        className="text-xs text-slate-400 hover:text-slate-600"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                      {quickHsmTemplatesList.map((tpl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSendHsmTemplate(tpl.title, tpl.text, tpl.key)}
                          className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                            isDark 
                              ? 'border-white/5 bg-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/30 text-slate-200' 
                              : 'border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-slate-800'
                          }`}
                        >
                          <strong className="block text-[11px] text-emerald-500 mb-0.5">{tpl.title}</strong>
                          <p className="text-[10px] opacity-80 line-clamp-1">{tpl.text}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popover: Quick Answers */}
                {showQuickAnswers && (
                  <div className={`absolute bottom-16 left-0 right-0 p-4 rounded-2xl border shadow-2xl z-30 space-y-2 animate-fade-in ${
                    isDark ? 'bg-[#141926] border-cyan-500/30' : 'bg-white border-cyan-300'
                  }`}>
                    <div className="flex items-center justify-between border-b pb-2 border-black/5 dark:border-white/10">
                      <strong className={`text-xs font-bold flex items-center gap-1.5 ${
                        isDark ? 'text-cyan-400' : 'text-cyan-700'
                      }`}>
                        <Zap className="w-3.5 h-3.5" />
                        <span>Respuestas Rápidas del Salón</span>
                      </strong>
                      <button
                        type="button"
                        onClick={() => setShowQuickAnswers(false)}
                        className="text-xs text-slate-400 hover:text-slate-600"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                      {quickAnswersList.map((qa, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setInputText(qa.text);
                            setShowQuickAnswers(false);
                          }}
                          className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                            isDark 
                              ? 'border-white/5 bg-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/30 text-slate-200' 
                              : 'border-slate-200 bg-slate-50 hover:bg-cyan-50 hover:border-cyan-300 text-slate-800'
                          }`}
                        >
                          <strong className="block text-[11px] text-cyan-400 mb-0.5">{qa.title}</strong>
                          <p className="text-[10px] opacity-80 line-clamp-1">{qa.text}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Toolbar Buttons */}
                <div className="flex items-center gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowQuickTemplates(!showQuickTemplates);
                      setShowQuickAnswers(false);
                    }}
                    className={`text-[11px] font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                      showQuickTemplates
                        ? 'bg-emerald-500 text-black border-emerald-400'
                        : isDark
                          ? 'bg-white/5 hover:bg-white/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Plantillas HSM</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowQuickAnswers(!showQuickAnswers);
                      setShowQuickTemplates(false);
                    }}
                    className={`text-[11px] font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                      showQuickAnswers
                        ? 'bg-cyan-500 text-black border-cyan-400'
                        : isDark
                          ? 'bg-white/5 hover:bg-white/10 text-cyan-400 border-cyan-500/20'
                          : 'bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border-cyan-200'
                    }`}
                  >
                    <Zap className="w-3 h-3" />
                    <span>Respuestas Rápidas</span>
                  </button>
                </div>

                {/* Form Input Message */}
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={
                      activeThread.humanTakeoverActive
                        ? 'Escribe como recepcionista o estilista humano...'
                        : 'Escribe un mensaje en nombre de Flowy IA...'
                    }
                    className={`flex-1 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:border-emerald-500 transition-all ${
                      isDark
                        ? 'bg-[#0B0E14] border border-white/10 text-white placeholder-slate-500'
                        : 'bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 text-black font-extrabold p-3 rounded-2xl flex items-center justify-center shadow-md shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-40 shrink-0"
                    title="Enviar mensaje"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* ======================================================================= */}
          {/* COLUMNA 3: EXPEDIENTE 360° & ACCIONES RÁPIDAS (3 COLS) */}
          {/* ======================================================================= */}
          <div className="lg:col-span-3 space-y-4">
            <div className={`p-5 rounded-3xl border space-y-4 shadow-lg ${
              isDark ? 'bg-[#121622] border-white/10' : 'bg-white border-slate-200'
            }`}>
              
              <div className="flex items-center justify-between border-b pb-3 border-black/5 dark:border-white/10">
                <h3 className={`text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  <FileText className="w-3.5 h-3.5 text-[#FF5A36]" />
                  <span>Ficha 360° de la Clienta</span>
                </h3>
                {activeThread.clientCategory === 'vip' && (
                  <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                    VIP 360°
                  </span>
                )}
              </div>

              {/* Client Profile Snippet */}
              <div className="text-center space-y-2 pt-1">
                {activeThread.clientAvatar ? (
                  <img
                    src={activeThread.clientAvatar}
                    alt={activeThread.clientName}
                    className="w-16 h-16 rounded-3xl object-cover mx-auto border-2 border-emerald-500 shadow-md"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#FF5A36] to-pink-500 text-white font-extrabold text-xl flex items-center justify-center mx-auto shadow-md">
                    {activeThread.clientName.charAt(0)}
                  </div>
                )}
                <div>
                  <strong className={`text-sm font-extrabold block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {activeThread.clientName}
                  </strong>
                  <a
                    href={`https://wa.me/${activeThread.clientPhone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-emerald-500 hover:underline flex items-center justify-center gap-1 mt-0.5"
                  >
                    <span>{activeThread.clientPhone}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>

              {/* Upcoming / Current Appointment Card */}
              {activeThread.appointmentDetails ? (
                <div className={`p-3.5 rounded-2xl border space-y-2 ${
                  isDark ? 'bg-white/5 border-emerald-500/20' : 'bg-emerald-50/50 border-emerald-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-emerald-500 uppercase tracking-wider flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Cita Programada
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      {activeThread.appointmentDetails.status === 'en_atencion' ? 'En Atención' : 'Confirmada'}
                    </span>
                  </div>

                  <strong className={`text-xs block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {activeThread.appointmentDetails.serviceName}
                  </strong>

                  <div className={`text-[11px] space-y-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    <div className="flex justify-between">
                      <span>Estilista:</span>
                      <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>
                        {activeThread.appointmentDetails.stylistName}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Horario:</span>
                      <strong className="text-emerald-500">
                        {activeThread.appointmentDetails.date} • {activeThread.appointmentDetails.time}
                      </strong>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`p-3 rounded-2xl border text-center text-xs ${
                  isDark ? 'bg-white/5 border-white/5 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
                }`}>
                  Sin citas agendadas próximas.
                </div>
              )}

              {/* Quick Actions 1-Click Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={onOpenNewAppointment}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 text-black font-extrabold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Agendar Nueva Cita</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const clientObj = clients.find(c => c.phone_whatsapp === activeThread.clientPhone || c.full_name === activeThread.clientName);
                    if (clientObj && onOpenPosWithClient) {
                      onOpenPosWithClient(clientObj);
                    }
                  }}
                  className={`w-full text-xs font-bold py-2.5 px-3 rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isDark 
                      ? 'border-white/10 bg-white/5 hover:bg-white/10 text-white' 
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 shadow-sm'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5 text-[#FF5A36]" />
                  <span>Cobrar en Terminal POS</span>
                </button>
              </div>

              {/* Hair Color Diagnostic Note Snippet */}
              <div className={`p-3 rounded-2xl border space-y-1.5 ${
                isDark ? 'bg-[#0B0E14] border-white/5' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className="text-[10px] font-bold text-[#FF5A36] uppercase flex items-center gap-1">
                  <Scissors className="w-3 h-3" /> Ficha Técnica Capilar
                </span>
                <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Porosidad media. Fondo de decoloración 8. Tono Majirel 7.1 + 8.2 con Plex.
                </p>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MODO SIMULADOR SANDBOX (PRUEBAS AISLADAS DE PROMPTS) */}
      {/* ========================================================================= */}
      {boardMode === 'sandbox' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Columna Izquierda: Simulador Interactivo (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className={`p-6 rounded-3xl border flex flex-col h-[650px] shadow-xl ${
              isDark ? 'bg-[#121622] border-white/10' : 'bg-white border-slate-200'
            }`}>
              
              {/* Header Sandbox */}
              <div className={`flex items-center justify-between pb-4 border-b shrink-0 ${
                isDark ? 'border-white/10' : 'border-slate-100'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-black flex items-center justify-center shadow-lg shadow-amber-500/20">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className={`text-sm font-bold flex items-center gap-2 ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      <span>Simulador Sandbox de Flowy IA</span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 uppercase">
                        Entorno de Pruebas
                      </span>
                    </strong>
                    <span className={`text-[11px] block mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Prueba cómo responde tu IA a preguntas difíciles sin enviar mensajes reales a clientas.
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSandboxMessages([])}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    isDark ? 'border-white/10 hover:bg-white/10 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                  title="Limpiar conversación del sandbox"
                >
                  <RefreshCw className="w-3 h-3 inline mr-1" />
                  <span>Limpiar</span>
                </button>
              </div>

              {/* Sandbox Messages Body */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3.5 pr-2 my-2">
                {sandboxMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
                    <Bot className="w-12 h-12 text-emerald-500 opacity-50" />
                    <strong className="text-sm font-bold">Simulador Listo</strong>
                    <p className="text-xs max-w-sm">
                      Escribe cualquier mensaje como si fueras una clienta nueva para evaluar el tono, tarifas y recomendaciones de Flowy IA.
                    </p>
                  </div>
                ) : (
                  sandboxMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.sender === 'client' ? 'items-start' : 'items-end'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm ${
                          msg.sender === 'client'
                            ? isDark ? 'bg-[#1A2030] text-slate-100 border border-white/5' : 'bg-slate-100 text-slate-900 border border-slate-200'
                            : 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white'
                        }`}
                      >
                        {msg.sender === 'ai' && (
                          <div className="flex items-center gap-1.5 mb-1 text-[10px] font-bold text-emerald-200">
                            <Bot className="w-3 h-3" />
                            <span>{msg.senderName}</span>
                          </div>
                        )}
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                        <span className="text-[9px] opacity-70 block text-right mt-1">{msg.timestamp}</span>
                      </div>
                    </div>
                  ))
                )}

                {isSandboxThinking && (
                  <div className="flex items-start gap-2 text-xs text-slate-400 animate-pulse">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <span className="mt-1">Flowy IA está redactando la respuesta...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts to Test */}
              <div className="pt-2 border-t border-black/5 dark:border-white/10 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  💡 Preguntas de Prueba Rápidas:
                </span>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  {[
                    '¿Qué precio tiene el Balayage?',
                    '¿Dónde están ubicados?',
                    '¿Tienen parqueadero y aceptan perros?',
                    '¿Puedo agendar para hoy sábado?',
                    '¿Qué incluye la Keratina Orgánica?'
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSandboxInput(preset);
                      }}
                      className={`text-[11px] px-3 py-1 rounded-full border whitespace-nowrap transition-all cursor-pointer ${
                        isDark 
                          ? 'border-white/10 bg-white/5 hover:bg-white/10 text-slate-300' 
                          : 'border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-800'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                {/* Sandbox Input Form */}
                <form onSubmit={handleSendSandbox} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={sandboxInput}
                    onChange={(e) => setSandboxInput(e.target.value)}
                    placeholder="Simula un mensaje de clienta aquí..."
                    className={`flex-1 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:border-amber-500 transition-all ${
                      isDark
                        ? 'bg-[#0B0E14] border border-white/10 text-white placeholder-slate-500'
                        : 'bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={!sandboxInput.trim() || isSandboxThinking}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-95 text-black font-extrabold px-5 py-3 rounded-2xl flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50 shrink-0 text-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Probar</span>
                  </button>
                </form>
              </div>

            </div>
          </div>

          {/* Columna Derecha: Parámetros del Cerebro IA en Tiempo Real (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className={`p-6 rounded-3xl border space-y-4 shadow-xl ${
              isDark ? 'bg-[#121622] border-white/10' : 'bg-white border-slate-200'
            }`}>
              
              <div className="flex items-center gap-2.5 border-b pb-3 border-black/5 dark:border-white/10">
                <Bot className="w-5 h-5 text-emerald-500" />
                <div>
                  <strong className={`text-xs sm:text-sm font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Parámetros Activos del Agente IA
                  </strong>
                  <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Configuración vigente en tu cuenta del salón.
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Nombre & Tono</span>
                  <strong className={`text-xs block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {aiSettings?.agent_name || 'Flowy'} • {aiSettings?.personality_tone || 'Elegante & Cálido'}
                  </strong>
                </div>

                <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Dirección & Parqueadero</span>
                  <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    {aiSettings?.address_instructions || 'Carrera 43A # 1-50, El Poblado'}
                  </p>
                </div>

                <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Política de Cancelación</span>
                  <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    {aiSettings?.cancellation_policy || 'Cancelación con 4 horas de anticipación sin costo.'}
                  </p>
                </div>

                <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Preguntas Frecuentes Activas</span>
                  <span className="text-emerald-500 font-bold">
                    {aiSettings?.faqs?.length || 3} FAQs registradas en el cerebro
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
};
