/**
 * MODELOS DE DOMINIO - CAPA CORE
 * ------------------------------
 * Tipos compartidos entre el catálogo de precios, la calculadora de
 * cotización y el checkout. Centralizarlos aquí evita duplicar
 * definiciones y mantiene consistencia entre componentes.
 */

/** Canales de mensajería soportados por la plataforma */
export type Channel = 'whatsapp' | 'messenger' | 'instagram' | 'telegram' | 'tiktok' | 'livechat';

/** Identificadores de los planes comerciales (modelo SaaS por agente) */
export type PlanId = 'multiagente' | 'plus' | 'enterprise';

/** Un plan de suscripción con su precio base por agente/mes en USD */
export interface Plan {
  id: PlanId;
  /** Nombre comercial mostrado en tarjetas y checkout */
  name: string;
  /** Precio mensual por agente (0 si es a medida) */
  pricePerAgent: number;
  /** Descripción corta orientada al beneficio */
  tagline: string;
  /** Lista de capacidades incluidas (para el checklist de la tarjeta) */
  features: string[];
  /** true si el plan es el destacado comercialmente ("más popular") */
  highlighted: boolean;
  /** Notas sobre límites o requisitos (ej. mínimo 3 meses) */
  notes?: string;
}

/** Extras contratables que se suman al total de la cotización */
export interface Addon {
  id: string;
  name: string;
  /** Precio mensual fijo en USD (0 si es por uso, ej. por contacto) */
  monthlyPrice: number;
  unitPrice?: number;
  unitLabel?: string;
}

/** Resultado de la calculadora de planes de /es/precios */
export interface Quote {
  monthlyTotal: number;
  consumableCredits: number;
  breakdown: string[];
}
