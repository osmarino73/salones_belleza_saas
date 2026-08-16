## 📍 Estado Actual
- **Fase del Proyecto**: Plataforma 100% Desplegada en Producción en Netlify con CI/CD automático desde GitHub + Supabase Backend + Aislamiento Multi-Tenant de Negocios Reales + Portal de Reservas Dinámico con COP.
- **URL de Producción en Vivo**: **[https://belleza2027.netlify.app](https://belleza2027.netlify.app)**
- **Portal de Reservas Público**: **[https://belleza2027.netlify.app/reservas](https://belleza2027.netlify.app/reservas)**
- **Repositorio Oficial GitHub**: [https://github.com/osmarino73/salones_belleza_saas](https://github.com/osmarino73/salones_belleza_saas)

## 🎯 Foco para la Próxima Sesión
1. **Flujo de Notificaciones & Automatizaciones WhatsApp**:
   - Conectar los webhooks de n8n / Zernio para envío de recordatorios 24h y 2h antes de la cita.
2. **Caja POS & Cobros**:
   - Emisión de recibos digitales por WhatsApp y cálculo automático de abonos.
3. **Módulo de Fidelización & Campañas IA**:
   - Mensajes automáticos a clientas inactivas (+45 días sin visita).

## 📌 Decisiones & Ajustes Recientes
- **Aislamiento Multi-Tenant**: Cada salón nuevo inicia con su catálogo en \$ COP, su estilista máster (dueña), 0 citas ficticias y 0 clientes demo.
- **Moneda Predeterminada**: `$ COP` (Pesos Colombianos) seleccionada y sincronizada tanto en Onboarding como en el modal de Configuración del Salón.
- **Portal de Reservas Web**: Lee dinámicamente el parámetro `?salon=slug` y carga el nombre, catálogo en COP y especialistas de ese negocio.
- **Repositorio Limpio**: Sin archivos HTML estáticos obsoletos. Build Vite + React optimizado en Netlify.
