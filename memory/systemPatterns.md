# System Patterns & Architecture - BeautyFlow AI

## 🏗️ Stack Tecnológico
- **Frontend Core**: React 18 + TypeScript + Vite + Tailwind CSS + Lucide Icons.
- **Backend / Database**: Supabase (PostgreSQL 15+) con soporte Multi-Tenant (Row Level Security ready).
- **Automatizaciones & IA**: n8n Webhooks + OpenAI GPT-4o-mini + Meta Cloud API (WhatsApp Business).
- **Standalone Version**: Script `build_standalone.js` para compilar versiones HTML autocontenidas.

## 📐 Estructura de Directorios
```
salones_belleza_saas/
├── .agents/                    # Customizaciones y skills del workspace (Engram)
│   └── skills/
│       └── engram-memory/
├── memory/                     # Banco de Memoria Engram (Contexto persistente)
│   ├── activeContext.md
│   ├── progress.md
│   ├── decisionLog.md
│   ├── productContext.md
│   └── systemPatterns.md
├── src/                        # Código fuente React
│   ├── lib/
│   │   └── supabase.ts         # Cliente Supabase + Fallback Mock integrado
│   ├── pages/
│   │   ├── LandingPage.tsx     # Landing B2B de conversión con calculadora ROI
│   │   ├── DashboardPage.tsx   # Dashboard administrativo integral (Agenda, POS, Comisiones, CRM)
│   │   ├── BookingPage.tsx     # Portal público de reservas paso a paso
│   │   └── LoginPage.tsx       # Auth / Login
│   ├── types/
│   │   └── index.ts            # Tipos e interfaces TypeScript
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── schema.sql                  # Schema maestro PostgreSQL con triggers y vistas
├── DATOS_NEGOCIO.json          # Fuente única de verdad para datos comerciales y textos
├── FICHA_DISENO.md             # Sistema de diseño (Dark Mode, Rose Gold #E2A0A8, Neon Cyan #00F0FF)
├── AGENTS.md                   # Protocolo maestro de desarrollo y contexto para IAs
├── AUTOMATIZACIONES_WHATSAPP.md# Especificación del webhook n8n y agente IA
└── build_standalone.js         # Compilador de archivos HTML autónomos
```

## 🔐 Patrón de Conectividad Híbrida (Supabase / Local)
- Si `.env` contiene credenciales válidas de Supabase, `src/lib/supabase.ts` utiliza la base de datos remota en tiempo real.
- Si no hay conexión o se está en modo demo/offline, el sistema cae automáticamente en LocalStorage y Mock Data sin romper la UI.
