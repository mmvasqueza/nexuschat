/**
 * PÁGINA: PREGUNTAS FRECUENTES (/es/preguntas-frecuentes)
 * -------------------------------------------------------
 * FAQ completo reutilizando el acordeón compartido (mismo componente
 * que en home, patrón DRY). Estructura por categorías: plataforma,
 * canales, precios y seguridad.
 */
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FaqAccordionComponent, FaqItem } from '../../shared/components/faq-accordion/faq-accordion.component';
import { RevealDirective } from '../../shared/directives/reveal.directive';

interface FaqCategory {
  title: string;
  items: FaqItem[];
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [RouterLink, FaqAccordionComponent, RevealDirective],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss',
})
export class FaqComponent {
  readonly categories: FaqCategory[] = [
    {
      title: 'Plataforma',
      items: [
        {
          question: '¿Por qué elegir NexusChat?',
          answer:
            'Centralizamos WhatsApp Business, Messenger, Instagram Direct, Telegram y TikTok en una única plataforma colaborativa, con widget de chat gratuito para tu web y soporte en tu idioma.',
        },
        {
          question: '¿Cómo puedo probar la plataforma?',
          answer:
            'Crea una cuenta gratuita sin tarjeta, conecta tus canales en pocos clics e instala el widget. Tienes 7 días de prueba completa del módulo de chat; después, el widget sigue siendo gratuito.',
        },
        {
          question: '¿Es obligatorio instalar el widget en mi web?',
          answer:
            'No. Puedes conectar tu página de Facebook o tu cuenta de WhatsApp Business y gestionar solo las conversaciones entrantes de tus canales, sin widget web (y viceversa).',
        },
      ],
    },
    {
      title: 'Canales e integraciones',
      items: [
        {
          question: '¿Qué canales puedo integrar?',
          answer:
            'Facebook (Messenger), WhatsApp Business, Instagram, Telegram y TikTok. Todo gestionable también desde la app móvil para iOS y Android.',
        },
        {
          question: '¿Puedo conectar NexusChat con mi CRM?',
          answer:
            'Sí. Mediante API REST y webhooks puedes sincronizar contactos, conversaciones y métricas con tu CRM o ERP. Hay integraciones listas para los CRM más populares y soporte para sistemas propios.',
        },
      ],
    },
    {
      title: 'Precios y facturación',
      items: [
        {
          question: '¿Necesito tarjeta de crédito para empezar?',
          answer:
            'No. El registro y los 7 días de prueba no requieren tarjeta. Solo la necesitarás si decides contratar un plan de pago.',
        },
        {
          question: '¿Cómo funciona la facturación por agente?',
          answer:
            'Cada miembro de tu equipo con acceso a la bandeja consume una licencia mensual. Puedes añadir o quitar agentes en cualquier momento y la prorrata se refleja en la siguiente factura.',
        },
        {
          question: '¿Los precios incluyen impuestos?',
          answer:
            'Los precios mostrados no incluyen impuestos. El impuesto aplicable se calcula durante el proceso de pago según tu país.',
        },
      ],
    },
    {
      title: 'Seguridad y cumplimiento',
      items: [
        {
          question: '¿Mis datos están seguros?',
          answer:
            'Los datos se cifran en tránsito (TLS 1.3) y en reposo (AES-256). Contamos con SSO/SAML en el plan Enterprise y procesos alineados al RGPD.',
        },
        {
          question: '¿Los pagos son seguros?',
          answer:
            'Sí. Los pagos se procesan mediante Stripe (PCI-DSS Nivel 1). NexusChat nunca almacena los datos de tu tarjeta.',
        },
      ],
    },
  ];
}
