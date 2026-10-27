/**
 * ACORDEÓN DE PREGUNTAS FRECUENTES (componente compartido)
 * --------------------------------------------------------
 * Recibe una lista de {question, answer} con @Input y controla qué
 * ítem está abierto con una signal (solo uno a la vez, patrón acordeón).
 *
 * Se reutiliza en Home (sección FAQ) y en la página /es/preguntas-frecuentes,
 * demostrando el principio DRY: una sola implementación, dos consumidores.
 */
import { Component, Input, signal } from '@angular/core';

export interface FaqItem {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-faq-accordion',
  standalone: true,
  templateUrl: './faq-accordion.component.html',
  styleUrl: './faq-accordion.component.scss',
})
export class FaqAccordionComponent {
  /** Ítems a mostrar (viene del componente padre) */
  @Input({ required: true }) items: FaqItem[] = [];

  /** Índice del ítem abierto; -1 = todos cerrados */
  readonly openIndex = signal<number>(-1);

  /** Alterna un ítem: si ya estaba abierto lo cierra (toggle) */
  toggle(index: number): void {
    this.openIndex.update((current) => (current === index ? -1 : index));
  }
}
