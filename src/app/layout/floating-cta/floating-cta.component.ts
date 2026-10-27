/**
 * BOTÓN FLOTANTE DE CONVERSACIÓN
 * ------------------------------
 * Réplica del widget de chat flotante típico de este negocio:
 * un FAB (Floating Action Button) dorado abajo a la derecha que
 * despliega un mini-panel con opciones de contacto (WhatsApp, demo).
 *
 * Implementado con signals + animaciones CSS. Podría conectarse en
 * producción al módulo real de chat (ver ChatComponent).
 */
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-floating-cta',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './floating-cta.component.html',
  styleUrl: './floating-cta.component.scss',
})
export class FloatingCtaComponent {
  /** Panel desplegado o cerrado */
  readonly open = signal(false);

  toggle(): void {
    this.open.update((v) => !v);
  }
}
