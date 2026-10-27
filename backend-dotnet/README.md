# NexusChat - Backend de Pagos (.NET 8)

Backend mínimo y seguro para procesar las suscripciones de la plataforma.
Expone **2 endpoints** consumidos por el frontend Angular:

| Endpoint | Quién lo llama | Para qué |
|---|---|---|
| `POST /api/payments/checkout` | `PaymentService.pay()` (Angular) | Crear la sesión de pago en Stripe |
| `POST /api/payments/webhook` | Stripe (servidor a servidor) | Confirmar el cobro y activar la suscripción |

## Arquitectura del flujo de pago

```
Usuario elige plan en /es/precios
   └─> /es/checkout/:planId (CheckoutComponent)
        └─> PaymentService.pay(planId, agents)
             └─> POST /api/payments/checkout  (backend .NET)
                  └─> Stripe API crea Checkout Session (precio calculado EN SERVIDOR)
                       └─> Angular redirige a checkout.stripe.com (hospedado)
                            └─> Usuario paga con tarjeta / Apple Pay / Google Pay
                                 └─> Stripe -> POST /api/payments/webhook
                                      └─> Backend activa suscripción en BD ✓
```

## Puesta en marcha (Stripe)

1. **Crea cuenta en** https://dashboard.stripe.com (modo test).
2. Copia la **Secret key** (`sk_test_...`) en `appsettings.json` → `STRIPE_SECRET_KEY`.
3. Copia la **Publishable key** (`pk_test_...`) en
   `nexuschat/src/environments/environment.ts` → `stripePublicKey`.
4. Crea el **webhook**: en el dashboard → Developers → Webhooks →
   Add endpoint → `http://localhost:5000/api/payments/webhook` →
   evento `checkout.session.completed`. Copia el **Signing secret**
   (`whsec_...`) en `STRIPE_WEBHOOK_SECRET`.
5. Ejecuta:

```bash
cd backend-dotnet/Payment.Api
dotnet restore
dotnet run
# Escucha en http://localhost:5000
```

6. Para probar el webhook en local usa Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:5000/api/payments/webhook
   ```

## Pasarelas alternativas

### PayPal
1. En https://developer.paypal.com crea una **Subscription Plan**
   (Billing → Subscriptions) para cada plan de NexusChat.
2. El backend genera un token de acceso (OAuth2, client_id/secret en servidor)
   y devuelve al frontend la URL de aprobación:
   `https://www.paypal.com/webapps/billing/plans/{PLAN_ID}`
3. Configura un webhook en PayPal para el evento
   `BILLING.SUBSCRIPTION.ACTIVATED` (equivalente a nuestro webhook de Stripe)
   y activa la suscripción ahí, nunca solo en el return URL.

### Mercado Pago (Latam)
Mismo patrón: `POST /v1/payments` con `access_token` en servidor +
webhook `payment.approved`. El `PaymentService` de Angular solo cambia
el endpoint al que hace POST.

### Tarjeta sin redirección (Stripe Elements)
Si prefieres el formulario de tarjeta DENTRO de tu checkout en lugar de
redirigir, usa **Payment Intents + Stripe Elements**: el backend crea un
`PaymentIntent` (`sk_` en servidor) y el frontend monta el elemento con
la `pk_`. Más control UX, más responsabilidad PCI (requiere SAQ A-EP).

## Seguridad (checklist de producción)

- [ ] `sk_live_...` y `pk_live_...` (modo live), nunca en el repo → variables de entorno
- [ ] HTTPS obligatorio en backend y frontend
- [ ] CORS restringido al dominio real (sustituir localhost:4200)
- [ ] Idempotencia en el webhook (tabla de eventos procesados por `session.Id`)
- [ ] Validar `agents` y `planId` contra la base de datos, no contra un switch
- [ ] Registrar cada webhook recibido (auditoría)
