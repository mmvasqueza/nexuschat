# NexusChat — Plataforma SaaS de Atención al Cliente (Angular 22)

Clon funcional del **modelo de negocio** de una plataforma multiagente de
mensajería (WhatsApp, Messenger, Instagram, Telegram y TikTok en una sola
bandeja), reimplementado con código y contenido originales, paleta
corporativa premium (azul marino + dorado champán) y pasarela de pagos
conectable.

> ⚠️ Proyecto demostrativo con fines educativos. El texto e imágenes son
> originales: replica la **estructura** del modelo de negocio de referencia,
> no su contenido protegido.

## Stack y tecnologías (y el aporte de cada una)

| Tecnología | Aporte |
|---|---|
| **Angular 22** (última versión estable) | Framework base: standalone components, signals, zoneless |
| **Zoneless change detection** (`provideZonelessChangeDetection`) | Sin Zone.js: menos bundle y mejor rendimiento |
| **Signals** (`signal`, `computed`) | Calculadora de precios reactiva sin RxJS; estado de sesión reactivo en navbar |
| **Reactive Forms** | Formularios de registro/login/checkout con validación y accesibilidad (aria-describedby) |
| **Lazy loading** (`loadComponent` en rutas) | Cada página descarga su chunk solo cuando se visita |
| **`@stripe/stripe-js`** | Redirección segura al checkout hospedado de Stripe (PCI-DSS) |
| **SCSS con design tokens** | Paleta centralizada en `styles.scss`: cambiar colores de todo el sitio editando variables |
| **Inter + Sora (Google Fonts)** | Tipografía corporativa premium |
| **SVG originales** | 10 ilustraciones vectoriales creadas para el proyecto (navy/dorado) |
| **ASP.NET Core 8 backend** | Crea sesiones de pago y recibe webhooks de Stripe con la secret key en servidor |

## Estructura del proyecto

```
nexuschat/
├── backend-dotnet/          → API de pagos Stripe (.NET 8 Minimal API)
└── src/
    ├── environments/        → apiUrl + Stripe public key por ambiente
    ├── assets/images/       → Logo + 9 ilustraciones SVG originales
    └── app/
        ├── app.config.ts    → Zoneless, Router, HttpClient, animaciones
        ├── app.routes.ts    → Rutas /es/... con carga diferida
        ├── core/            → modelos, catálogo de precios, servicios
        │   ├── models/plan.model.ts
        │   ├── data/plans.data.ts        → fuente única de planes/precios
        │   └── services/
        │       ├── pricing.service.ts    → signals: agents, channels, quote()
        │       ├── payment.service.ts    → Stripe checkout desde Angular
        │       ├── auth.service.ts       → sesión con signals
        │       └── seo.service.ts        → title/meta por ruta
        ├── layout/          → navbar, footer, botón flotante
        ├── shared/          → directiva reveal (scroll animations), acordeón FAQ
        └── features/        → una carpeta por página
            ├── home/                     → /es
            ├── chat/ chatbot/ broadcast/ api/   → /es/funcionalidades/*
            ├── pricing/                  → /es/precios + calculadora
            ├── signup/                   → /es/crea-una-cuenta-gratuita
            ├── login/ checkout/ demo/ faq/ legal/
```

## Mapa de rutas

| URL | Página |
|---|---|
| `/es` | Home (hero, suite, canales, stats, testimonios, FAQ, CTA) |
| `/es/funcionalidades/chat` | Bandeja multicanal |
| `/es/funcionalidades/chatbot` | Chatbot con IA |
| `/es/funcionalidades/broadcast` | Campañas masivas |
| `/es/funcionalidades/api` | API & Webhooks |
| `/es/precios` | Planes + extras + calculadora de cotización |
| `/es/crea-una-cuenta-gratuita` | Registro (email de trabajo, empresa, pass, SSO mock) |
| `/es/iniciar-sesion` | Login |
| `/es/checkout/:planId` | Resumen + pago Stripe |
| `/es/demo` | Captación de lead B2B |
| `/es/preguntas-frecuentes` | FAQ completo por categorías |
| `/es/privacidad` · `/es/terminos` | Legal |

## Ejecutar el frontend

```bash
npm install
ng serve
# http://localhost:4200/es
```

## Conectar pagos reales

1. Sigue `backend-dotnet/README.md` (Stripe keys, webhook, `dotnet run`).
2. Edita `src/environments/environment.ts`:
   - `apiUrl`: donde escuche el backend .NET
   - `stripePublicKey`: tu `pk_test_...`
3. Flujo completo documentado (con diagrama) en el README del backend.

## Decisiones de diseño

- **Paleta premium**: `--navy-900 #0A1628`, `--gold-500 #C9A96E`,
  `--ivory #F7F4EE`. Tokens en `:root` de `src/styles.scss`.
- **Imágenes**: todas son SVG vectoriales originales en
  `src/assets/images/` — escalables, ligeras y coherentes con la marca.
- **Accesibilidad**: navegación por teclado, `aria-*` en formularios y
  acordeones, `prefers-reduced-motion` respetado.
- **Comentarios**: cada función/documento explica QUÉ hace y CÓMO se
  conecta con el resto de la arquitectura.
