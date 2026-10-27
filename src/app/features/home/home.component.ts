/**
 * PÁGINA HOME (/es)
 * -----------------
 * Replica la estructura de la landing del modelo de negocio de referencia:
 *
 *  1. Hero oscuro: propuesta de valor + captura del producto + CTAs
 *  2. Suite de módulos: Chat / Chatbot IA / Broadcast / API (tarjetas)
 *  3. Centralización de canales (banda de logos + copy)
 *  4. Enrutamiento por departamentos (alternado imagen/texto)
 *  5. Estadísticas y control (métricas en vivo con contadores animados)
 *  6. Testimonios
 *  7. FAQ (componente compartido)
 *  8. CTA final (crear cuenta gratuita)
 *
 * Todo el copy es original, adaptado al mismo modelo de negocio SaaS
 * multiagente (bandeja multicanal + automatización + difusión + API).
 *
 * Estado: los contadores de la sección de estadísticas usan signals y
 * un IntersectionObserver para animarse solo cuando son visibles.
 */
import { Component, signal, inject, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';

import { RevealDirective } from '../../shared/directives/reveal.directive';
import { FaqAccordionComponent, FaqItem } from '../../shared/components/faq-accordion/faq-accordion.component';

/** Datos de la suite de módulos (tarjetas principales) */
interface ModuleCard {
  icon: string;
  title: string;
  description: string;
  link: string;
  image: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, RevealDirective, FaqAccordionComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef);

  // ------------------------------------------------------------------
  // CONTENIDO: suite de módulos (imágenes SVG originales en /assets)
  // ------------------------------------------------------------------
  readonly modules: ModuleCard[] = [
    {
      icon: '💬',
      title: 'Módulo de Chat',
      description:
        'Optimiza la comunicación con tus clientes integrando WhatsApp, Facebook, Instagram, Telegram y TikTok en una sola bandeja compartida.',
      link: '/es/funcionalidades/chat',
      image: 'assets/images/illustration-chat.svg',
    },
    {
      icon: '🤖',
      title: 'Chatbot Avanzado con IA',
      description:
        'Automatiza conversaciones de ventas y soporte con un chatbot inteligente y un flow builder visual de arrastrar y soltar.',
      link: '/es/funcionalidades/chatbot',
      image: 'assets/images/illustration-bot.svg',
    },
    {
      icon: '📡',
      title: 'Módulo Broadcast',
      description:
        'Mantén informados a tus clientes con newsletters, promociones y mensajes masivos por WhatsApp medibles y segmentables.',
      link: '/es/funcionalidades/broadcast',
      image: 'assets/images/illustration-broadcast.svg',
    },
    {
      icon: '🔌',
      title: 'API & Webhooks',
      description:
        'Conecta NexusChat con tu CRM y ERP corporativos, y programa mensajes y tareas automatizadas desde tus sistemas.',
      link: '/es/funcionalidades/api',
      image: 'assets/images/illustration-api.svg',
    },
  ];

  /** Canales centralizados (banda de logos de la sección 3) */
  readonly channels = ['WhatsApp', 'Messenger', 'Instagram', 'Telegram', 'TikTok'];

  /** Métricas animadas: valor final y sufijo (el contador sube al visible) */
  readonly stats = signal([
    { value: 1000, suffix: '+', label: 'empresas confían en la plataforma' },
    { value: 98, suffix: '%', label: 'de satisfacción en atención al cliente' },
    { value: 45, suffix: '%', label: 'más rápida la respuesta media del equipo' },
    { value: 24, suffix: '/7', label: 'soporte en español, inglés e italiano' },
  ]);

  /** Testimonios (perfiles ficticios para la demo) */
  readonly testimonials = [
    {
      quote: 'Centralizamos WhatsApp, Instagram y Messenger en una semana. El tiempo de respuesta de nuestro equipo de ventas se redujo a la mitad.',
      name: 'Laura Méndez',
      role: 'Head of CX, RetailPro',
    },
    {
      quote: 'El flow builder nos permitió automatizar el 60% de las preguntas frecuentes. Nuestros agentes ahora cierran más ventas.',
      name: 'Andrés Rojas',
      role: 'Gerente de Operaciones, ViajaMax',
    },
    {
      quote: 'La API y los webhooks nos conectaron con nuestro CRM en dos días. Soporte excepcional en español, algo raro en este mercado.',
      name: 'Carolina Vidal',
      role: 'CTO, Finanx',
    },
  ];

  /** FAQ de la home (el componente completo está en /es/preguntas-frecuentes) */
  readonly faqItems: FaqItem[] = [
    {
      question: '¿Por qué elegir NexusChat?',
      answer:
        'Es la herramienta que centraliza WhatsApp Business, Messenger, Instagram Direct, Telegram y TikTok en una única plataforma pensada para la colaboración de equipos, con widget de chat gratuito para tu web.',
    },
    {
      question: '¿Cómo puedo probar la plataforma?',
      answer:
        'Crea una cuenta gratuita sin tarjeta de crédito, conecta tus canales en pocos clics y prueba el módulo de chat durante 7 días sin restricciones. Después puedes seguir usando el widget gratis.',
    },
    {
      question: '¿Qué canales puedo integrar?',
      answer:
        'Página de Facebook (Messenger), cuenta de WhatsApp Business, Instagram, canal de Telegram y TikTok. Todo gestionable también desde la app móvil para iOS y Android.',
    },
    {
      question: '¿Necesito tarjeta de crédito para empezar?',
      answer:
        'No. El registro y la prueba de 7 días no requieren tarjeta. Solo la necesitarás si decides contratar un plan de pago desde la página de precios.',
    },
  ];

  /** Valores animados actuales (signal) para cada métrica */
  readonly animatedStats = signal(this.stats().map(() => 0));
  private counterObserver: IntersectionObserver | null = null;

  /**
   * Arranca el IntersectionObserver que anima los contadores cuando la
   * sección de estadísticas entra en pantalla. En zoneless, mutamos el
   * DOM/signals directamente y Angular repinta por granularidad de señal.
   */
  ngOnInit(): void {
    const statsSection = this.el.nativeElement.querySelector('#stats');
    if (!statsSection) return;

    this.counterObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          this.animateCounters();
          this.counterObserver?.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    this.counterObserver.observe(statsSection);
  }

  /** Animación de conteo ascendente (ease-out cúbico, ~1.6s) */
  private animateCounters(): void {
    const duration = 1600;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      this.animatedStats.set(
        this.stats().map((s) => Math.round(s.value * eased)),
      );
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  ngOnDestroy(): void {
    this.counterObserver?.disconnect();
  }
}
