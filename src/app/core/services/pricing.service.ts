/**
 * SERVICIO DE PRECIOS - REACTIVO CON SIGNALS
 * ------------------------------------------
 * Responsabilidad: exponer el catálogo comercial y calcular cotizaciones.
 *
 * Por qué Signals y no RxJS: el estado aquí es sincrónico y simple
 * (catálogo + configuración de la calculadora). Con `signal()` y
 * `computed()` obtenemos reactividad fina sin suscripciones: cualquier
 * componente que lea `quote()` se re-renderiza automáticamente cuando
 * cambia un agente o un canal.
 *
 * Conexión con otros servicios: CheckoutComponent usa `getPlan()` para
 * resolver el plan de la URL y PaymentService usa el total calculado.
 */
import { Injectable, computed, signal } from '@angular/core';

import { ADDONS, PLANS, PRICING_RULES } from '../data/plans.data';
import { Addon, Channel, Plan, PlanId, Quote } from '../models/plan.model';

/** Precio mensual de cada canal conectado (créditos consumibles) */
const CHANNEL_PRICES: Record<Channel, number> = {
  whatsapp: 22,
  messenger: 0,
  instagram: 22,
  telegram: 0,
  tiktok: 0,
  livechat: 0,
};

@Injectable({ providedIn: 'root' }) // Una única instancia para toda la app
export class PricingService {
  /** Catálogo inmutable de planes (fuente: plans.data.ts) */
  readonly plans: readonly Plan[] = PLANS;

  /** Catálogo inmutable de extras */
  readonly addons: readonly Addon[] = ADDONS;

  // ------------------------------------------------------------------
  // ESTADO REACTIVO DE LA CALCULADORA (signals escritas)
  // ------------------------------------------------------------------

  /** Número de agentes contratados (mínimo 1) */
  readonly agents = signal<number>(3);

  /** Mapa canal -> ¿conectado? para la cotización */
  readonly channels = signal<Record<Channel, boolean>>({
    whatsapp: true,
    messenger: false,
    instagram: false,
    telegram: false,
    tiktok: false,
    livechat: false,
  });

  /** Extras seleccionados en la calculadora */
  readonly selectedAddons = signal<Set<string>>(new Set(['bot-builder']));

  // ------------------------------------------------------------------
  // DERIVADOS (signals computadas) - se recalculan solos ante cambios
  // ------------------------------------------------------------------

  /**
   * Cotización mensual total. Se actualiza automáticamente cuando
   * cambia agents(), channels() o selectedAddons().
   */
  readonly quote = computed<Quote>(() => {
    const breakdown: string[] = [];
    let total = 0;
    let credits = 0;

    // 1) Coste base por agentes (plan Plus como referencia de calculadora)
    const basePerAgent = 20;
    const agentsCost = this.agents() * basePerAgent;
    total += agentsCost;
    breakdown.push(`${this.agents()} agentes × $${basePerAgent}`);

    // 2) Canales conectados (créditos consumibles)
    const activeChannels = (Object.entries(this.channels()) as [Channel, boolean][])
      .filter(([, on]) => on);
    for (const [ch] of activeChannels) {
      const price = CHANNEL_PRICES[ch];
      if (price > 0) {
        credits += price;
        breakdown.push(`Canal ${ch}: +$${price} en créditos`);
      }
    }

    // 3) Extras fijos
    for (const id of this.selectedAddons()) {
      const addon = ADDONS.find((a) => a.id === id);
      if (addon && addon.monthlyPrice > 0) {
        total += addon.monthlyPrice;
        breakdown.push(`${addon.name}: $${addon.monthlyPrice}/mes`);
      }
    }

    return {
      monthlyTotal: total,
      consumableCredits: credits,
      breakdown,
    };
  });

  // ------------------------------------------------------------------
  // API PÚBLICA
  // ------------------------------------------------------------------

  /** Devuelve un plan por su id (usado por checkout con el :planId de la URL) */
  getPlan(id: PlanId): Plan | undefined {
    return PLANS.find((p) => p.id === id);
  }

  /** Incrementa/decrementa agentes sin bajar de 1 (regla de negocio) */
  setAgents(count: number): void {
    this.agents.set(Math.max(1, count));
  }

  /** Activa o desactiva un canal en la calculadora */
  toggleChannel(channel: Channel): void {
    this.channels.update((c: Record<Channel, boolean>) => ({ ...c, [channel]: !c[channel] }));
  }

  /** Activa o desactiva un extra */
  toggleAddon(id: string): void {
    this.selectedAddons.update((set: Set<string>) => {
      const next = new Set(set);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  /** Reglas de negocio expuestas a la vista (mínimo de meses, etc.) */
  readonly rules = PRICING_RULES;
}
