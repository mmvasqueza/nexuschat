/**
 * CATÁLOGO COMERCIAL (datos estáticos)
 * ------------------------------------
 * Réplica adaptada del modelo de precios SaaS por agente:
 *  - Plan base multiagente con canales de mensajería.
 *  - Plan Plus con módulos avanzados (bot, broadcast, métricas).
 *  - Enterprise a medida con SSO/SAML e IA.
 *  - Extras: bot builder, difusión por consumo y cuentas adicionales.
 *
 * Este archivo es la ÚNICA fuente de verdad de precios: lo consumen
 * la página de precios, la calculadora y el checkout. Si mañana cambia
 * un precio, se edita aquí y todo el sitio se actualiza.
 */
import { Addon, Plan } from '../models/plan.model';

export const PLANS: Plan[] = [
  {
    id: 'multiagente',
    name: 'Chat Multiagente',
    pricePerAgent: 15,
    tagline: 'Administra los chats de tus redes sociales desde una sola bandeja.',
    features: [
      'Módulo de gestión de chat multicanal',
      'Facebook Messenger incluido',
      'Instagram Direct (+$22/mes)',
      'WhatsApp Business (desde $22/mes en créditos consumibles)',
      'Aplicación móvil iOS y Android',
      'Widget de chat gratis para tu web',
    ],
    highlighted: false,
    notes: 'Sin tarjeta de crédito para comenzar la prueba.',
  },
  {
    id: 'plus',
    name: 'Chat Multiagente Plus',
    pricePerAgent: 20,
    tagline: 'Todo lo del plan Multiagente, más automatización y difusión.',
    features: [
      'Todo lo incluido en Chat Multiagente',
      'Chatbot avanzado con flow builder',
      'Campañas de difusión masiva por WhatsApp',
      'Enrutamiento automático por departamentos',
      'Estadísticas y métricas en tiempo real',
      'Integraciones API & Webhooks',
    ],
    highlighted: true, // plan "más popular" en la UI
    notes: 'Recomendado para equipos de venta y soporte.',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    pricePerAgent: 0,
    tagline: 'Construido a la medida de tus necesidades.',
    features: [
      'Todo lo incluido en Chat Multiagente Plus',
      '50+ agentes y SLA dedicado',
      'Integración con modelos de IA (ChatGPT / Gemini)',
      'Autenticación SAML / SSO',
      'Onboarding y soporte premium 24/7',
      'Infraestructura dedicada opcional',
    ],
    highlighted: false,
    notes: 'Precio personalizado según volumen. Mínimo 3 meses.',
  },
];

/** Extras de la calculadora de cotización (rúbrica de personalización) */
export const ADDONS: Addon[] = [
  {
    id: 'broadcast',
    name: 'Módulo de difusión / campañas en WhatsApp',
    monthlyPrice: 0,
    unitPrice: 0.02, // USD por contacto alcanzado
    unitLabel: 'por contacto alcanzado',
  },
  {
    id: 'bot-builder',
    name: 'Módulo Advanced Bot Builder para mensajería',
    monthlyPrice: 65.55,
  },
  {
    id: 'extra-account',
    name: 'Cuenta extra de FB / Insta / WhatsApp / Telegram / TikTok',
    monthlyPrice: 22,
  },
];

/** Reglas de negocio de la cotización (mínimos, créditos, etc.) */
export const PRICING_RULES = {
  /** Mínimo de meses exigidos para contratar */
  minMonths: 3,
  /** Cada canal conectado genera créditos consumibles (USD/mes) */
  consumableCreditPerChannel: 22,
} as const;
