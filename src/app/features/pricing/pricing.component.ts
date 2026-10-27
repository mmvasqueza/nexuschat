/**
 * PÁGINA DE PRECIOS (/es/precios)
 * -------------------------------
 * Réplica del modelo de monetización SaaS por agente:
 *  1. Tres planes (Multiagente $15, Plus $20, Enterprise a medida).
 *  2. Extras: difusión por consumo ($0.02/contacto), bot builder ($65.55)
 *     y cuentas extra de canal ($22).
 *  3. Calculadora de cotización: agentes + canales + extras -> total
 *     mensual calculado en vivo con signals (PricingService).
 *  4. FAQ comercial y CTA de demo.
 *
 * La calculadora ilustra el patrón "local state + computed": cada clic
 * actualiza signals del servicio y el total se redibuja sin suscripciones.
 * El botón de cada plan navega a /es/checkout/:planId, donde se conecta
 * la pasarela de pagos (PaymentService -> backend .NET -> Stripe).
 */
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PricingService } from '../../core/services/pricing.service';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { FaqAccordionComponent, FaqItem } from '../../shared/components/faq-accordion/faq-accordion.component';
import { Channel } from '../../core/models/plan.model';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [RouterLink, RevealDirective, FaqAccordionComponent],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.scss',
})
export class PricingComponent {
  /** El servicio expone plans, addons, quote (computed) y mutadores */
  protected readonly pricing = inject(PricingService);

  /** Canales disponibles en la calculadora (label + id) */
  readonly channelOptions: { id: Channel; label: string; price: number }[] = [
    { id: 'whatsapp', label: 'WhatsApp', price: 22 },
    { id: 'messenger', label: 'Facebook Messenger', price: 0 },
    { id: 'instagram', label: 'Instagram Direct', price: 22 },
    { id: 'telegram', label: 'Telegram', price: 0 },
    { id: 'tiktok', label: 'TikTok', price: 0 },
    { id: 'livechat', label: 'Chat en vivo (widget)', price: 0 },
  ];

  /** FAQ comercial específica de precios */
  readonly faqItems: FaqItem[] = [
    {
      question: '¿Cómo funciona la facturación por agente?',
      answer:
        'Cada agente (miembro de tu equipo con acceso a la bandeja) consume una licencia mensual. Puedes añadir o quitar agentes en cualquier momento y la prorrata se refleja en la siguiente factura.',
    },
    {
      question: '¿Qué son los créditos consumibles de WhatsApp?',
      answer:
        'Los canales de pago como WhatsApp Business o Instagram Direct generan créditos mensuales (desde $22) que se consumen según el volumen de conversaciones. Los créditos no usados no caducan durante la suscripción activa.',
    },
    {
      question: '¿Puedo cambiar de plan después?',
      answer:
        'Sí. Puedes hacer upgrade o downgrade en cualquier momento desde tu panel. Los cambios de upgrade se aplican de inmediato; los de downgrade al inicio del siguiente ciclo.',
    },
    {
      question: '¿El plan Enterprise tiene permanencia?',
      answer:
        'Los planes Enterprise se contratan con un mínimo de 3 meses e incluyen onboarding dedicado, SLA, SSO/SAML e integración con modelos de IA.',
    },
  ];
}
