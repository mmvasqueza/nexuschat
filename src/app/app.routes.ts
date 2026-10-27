/**
 * DEFINICIÓN DE RUTAS - ESTRUCTURA ESPEJO DEL SITIO ORIGINAL
 * ----------------------------------------------------------
 * Cada página se carga con loadComponent (carga diferida/lazy), de modo
 * que el bundle inicial solo contiene el layout + home. Esto replica la
 * arquitectura de URLs del sitio de referencia:
 *
 *   /es                                  -> Home
 *   /es/funcionalidades/chat             -> Módulo bandeja multicanal
 *   /es/funcionalidades/chatbot          -> Módulo bot con IA
 *   /es/funcionalidades/broadcast        -> Módulo campañas masivas
 *   /es/funcionalidades/api              -> Módulo API & Webhooks
 *   /es/precios                          -> Planes + calculadora de cotización
 *   /es/crea-una-cuenta-gratuita         -> Registro (página solicitada)
 *   /es/iniciar-sesion                   -> Login
 *   /es/checkout/:planId                 -> Pasarela de pago
 *   /es/demo                             -> Agenda de demo
 *   /es/preguntas-frecuentes             -> FAQ
 *   /es/privacidad, /es/terminos         -> Legal
 *
 * El wildcard '**' redirige a home (estrategia amigable para SEO).
 */
import { Routes } from '@angular/router';

export const routes: Routes = [
  // Redirección de la raíz al idioma por defecto (ES)
  { path: '', pathMatch: 'full', redirectTo: 'es' },

  {
    path: 'es',
    children: [
      {
        path: '',
        // Carga diferida: el chunk de home solo se descarga cuando se necesita
        loadComponent: () =>
          import('./features/home/home.component').then((m) => m.HomeComponent),
        data: { seo: { title: 'NexusChat | Plataforma de Atención al Cliente para WhatsApp y Mensajería' } },
      },
      {
        path: 'funcionalidades/chat',
        loadComponent: () =>
          import('./features/chat/chat.component').then((m) => m.ChatComponent),
        data: { seo: { title: 'Bandeja Multicanal | NexusChat' } },
      },
      {
        path: 'funcionalidades/chatbot',
        loadComponent: () =>
          import('./features/chatbot/chatbot.component').then((m) => m.ChatbotComponent),
        data: { seo: { title: 'Chatbot con IA | NexusChat' } },
      },
      {
        path: 'funcionalidades/broadcast',
        loadComponent: () =>
          import('./features/broadcast/broadcast.component').then((m) => m.BroadcastComponent),
        data: { seo: { title: 'Campañas Masivas por WhatsApp | NexusChat' } },
      },
      {
        path: 'funcionalidades/api',
        loadComponent: () =>
          import('./features/api/api.component').then((m) => m.ApiComponent),
        data: { seo: { title: 'API & Webhooks | NexusChat' } },
      },
      {
        path: 'precios',
        loadComponent: () =>
          import('./features/pricing/pricing.component').then((m) => m.PricingComponent),
        data: { seo: { title: 'Precios y Planes | NexusChat' } },
      },
      {
        path: 'crea-una-cuenta-gratuita',
        loadComponent: () =>
          import('./features/signup/signup.component').then((m) => m.SignupComponent),
        data: { seo: { title: 'Crea una cuenta gratuita | NexusChat' } },
      },
      {
        path: 'iniciar-sesion',
        loadComponent: () =>
          import('./features/login/login.component').then((m) => m.LoginComponent),
        data: { seo: { title: 'Iniciar sesión | NexusChat' } },
      },
      {
        // :planId es un parámetro dinámico ej. /es/checkout/plus
        path: 'checkout/:planId',
        loadComponent: () =>
          import('./features/checkout/checkout.component').then((m) => m.CheckoutComponent),
        data: { seo: { title: 'Finalizar suscripción | NexusChat' } },
      },
      {
        path: 'demo',
        loadComponent: () =>
          import('./features/demo/demo.component').then((m) => m.DemoComponent),
        data: { seo: { title: 'Programa una demo | NexusChat' } },
      },
      {
        path: 'preguntas-frecuentes',
        loadComponent: () =>
          import('./features/faq/faq.component').then((m) => m.FaqComponent),
        data: { seo: { title: 'Preguntas Frecuentes | NexusChat' } },
      },
      {
        path: 'privacidad',
        loadComponent: () =>
          import('./features/legal/privacy.component').then((m) => m.PrivacyComponent),
        data: { seo: { title: 'Política de Privacidad | NexusChat' } },
      },
      {
        path: 'terminos',
        loadComponent: () =>
          import('./features/legal/terms.component').then((m) => m.TermsComponent),
        data: { seo: { title: 'Términos de Servicio | NexusChat' } },
      },
    ],
  },

  // Cualquier URL desconocida vuelve al home (evita 404 duros en SPA)
  { path: '**', redirectTo: 'es' },
];
