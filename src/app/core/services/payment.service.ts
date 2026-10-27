/**
 * SERVICIO DE PAGOS - INTEGRACIÓN CON PASARELA (Stripe)
 * -----------------------------------------------------
 * RESPONSABILIDAD: orquestar el cobro de las suscripciones desde el
 * frontend. NUNCA maneja datos de tarjeta: eso es competencia exclusiva
 * de la pasarela (PCI-DSS). El flujo es:
 *
 *   1. Usuario elige plan en /es/precios
 *      -> navega a /es/checkout/:planId
 *   2. CheckoutComponent llama createCheckoutSession(planId, agents)
 *      -> POST a nuestro backend .NET (ver carpeta backend-dotnet/)
 *      -> El backend crea una "Checkout Session" en Stripe con la
 *         SECRET KEY (nunca expuesta al navegador) y devuelve su id.
 *   3. Aquí redirigimos al Checkout hospedado de Stripe con stripe-js.
 *   4. Stripe cobra y redirige a /es/checkout/estado?resultado=exito.
 *   5. El backend confirma con el WEBHOOK (fuente de verdad del cobro).
 *
 * Para producción solo hay que:
 *   - npm i @stripe/stripe-js  (ya incluido en package.json)
 *   - Levantar el backend-dotnet con las claves de Stripe en variables
 *     de entorno (STRIPE_SECRET_KEY).
 *   - Apuntar environment.apiUrl al dominio real del backend.
 */
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';

/** Respuesta esperada de nuestro backend al crear la sesión */
interface CheckoutSessionResponse {
  /** Id de la sesión de Stripe Checkout (ej. cs_test_...) */
  sessionId: string;
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly http = inject(HttpClient);

  /** Instancia de Stripe.js cargada de forma perezosa (singleton) */
  private stripe: Stripe | null = null;

  /**
   * Carga stripe.js una sola vez. Usa la PUBLIC KEY (publishable),
   * que es segura de exponer al navegador; la secret key vive solo
   * en el backend.
   */
  private async getStripe(): Promise<Stripe | null> {
    if (!this.stripe) {
      this.stripe = await loadStripe(environment.stripePublicKey);
    }
    return this.stripe;
  }

  /**
   * Crea la sesión de pago en el backend y redirige al Checkout de
   * Stripe. Es async porque combina HTTP + redirección externa.
   *
   * @param planId  Identificador del plan (multiagente | plus | enterprise)
   * @param agents  Número de agentes contratados (el total se calcula
   *                en el backend para evitar manipulación de precios
   *                desde el cliente: NUNCA confiar en totales del front).
   */
  async pay(planId: string, agents: number): Promise<void> {
    // 1) Pedimos al backend que cree la sesión (él fija precio e impuestos)
    const res = await firstValueFrom<CheckoutSessionResponse>(
      this.http.post<CheckoutSessionResponse>(`${environment.apiUrl}/payments/checkout`, {
        planId,
        agents,
      }),
    );
    const sessionId = res.sessionId;

    // 2) Redirigimos al checkout hospedado de Stripe (tarjeta, Apple Pay...)
    const stripe = await this.getStripe();
    if (!stripe) {
      throw new Error('No se pudo cargar la pasarela de pago. Revisa tu conexión.');
    }
    const { error } = await stripe.redirectToCheckout({ sessionId });
    if (error) {
      // error.message es seguro de mostrar (no expone datos sensibles)
      throw new Error(error.message ?? 'Error al iniciar el pago.');
    }
  }
}
