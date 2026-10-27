/**
 * PÁGINA: CHECKOUT (/es/checkout/:planId)
 * ---------------------------------------
 * Cierra el modelo de negocio: convierte la intención de /es/precios en
 * una suscripción pagada.
 *
 * FLUJO (PCI-DSS compliant: la tarjeta NUNCA toca nuestro servidor):
 *  1. Resuelve el :planId de la URL con ActivatedRoute y lo valida
 *     contra el catálogo (PricingService.getPlan).
 *  2. Muestra resumen del pedido (plan + agentes + total).
 *  3. Al confirmar, PaymentService.pay() llama a nuestro backend .NET
 *     (backend-dotnet/), que crea una Checkout Session en Stripe con la
 *     secret key, y redirige al checkout hospedado de Stripe.
 *  4. Stripe procesa el pago y redirige de vuelta con el resultado;
 *     la confirmación real llega por WEBHOOK al backend (fuente de verdad).
 *
 * Estados: idle | processing | error. Signals + control flow @if.
 */
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { PricingService } from '../../core/services/pricing.service';
import { PaymentService } from '../../core/services/payment.service';
import { Plan } from '../../core/models/plan.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  protected readonly pricing = inject(PricingService);
  private readonly payments = inject(PaymentService);

  /** Plan resuelto desde la URL (undefined = id inválido) */
  readonly plan = signal<Plan | undefined>(undefined);

  /** Estado del procesamiento del pago */
  readonly status = signal<'idle' | 'processing' | 'error'>('idle');

  /** Mensaje de error amigable si falla la redirección */
  readonly error = signal<string | null>(null);

  /** Plan Enterprise no se paga online: se agenda demo comercial */
  readonly isEnterprise = computed(() => this.plan()?.id === 'enterprise');

  /**
   * Lee el :planId de la URL. ActivatedRoute.paramMap es observable;
   * usamos firstValueFrom para tomarlo una vez (alternativa: toSignal).
   */
  ngOnInit(): void {
    const planId = this.route.snapshot.paramMap.get('planId') as Plan['id'] | null;
    this.plan.set(planId ? this.pricing.getPlan(planId) : undefined);
  }

  /**
   * Total a mostrar. NOTA: este total es informativo. El precio REAL lo
   * calcula el backend al crear la sesión (anti-manipulación).
   */
  readonly total = computed(() => {
    const p = this.plan();
    if (!p) return 0;
    return p.pricePerAgent * this.pricing.agents();
  });

  /** Inicia el pago redirigiendo a Stripe Checkout */
  async confirmPayment(): Promise<void> {
    const p = this.plan();
    if (!p) return;

    this.status.set('processing');
    this.error.set(null);
    try {
      await this.payments.pay(p.id, this.pricing.agents());
      // Si todo va bien, el navegador sale hacia Stripe (nada más que hacer)
    } catch (e) {
      this.status.set('error');
      this.error.set(e instanceof Error ? e.message : 'Error al iniciar el pago.');
    }
  }
}
