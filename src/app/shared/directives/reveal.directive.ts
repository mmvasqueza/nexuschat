/**
 * DIRECTIVA appReveal - ANIMACIÓN DE ENTRADA AL HACER SCROLL
 * -----------------------------------------------------------
 * Añade la clase CSS `reveal` al elemento y, cuando el IntersectionObserver
 * lo detecta visible en el viewport (>15%), le aplica `is-visible`.
 * El CSS global (styles.scss) define la transición fade+translate.
 *
 * Uso en cualquier plantilla: <section appReveal>
 *
 * Ventaja frente a librerías de animación: cero dependencias, respeta
 * prefers-reduced-motion (desactivada vía media query global) y funciona
 * con la detección de cambios zoneless porque solo muta el DOM nativo.
 */
import { Directive, ElementRef, OnDestroy, OnInit, inject } from '@angular/core';

@Directive({
  selector: '[appReveal]',
  standalone: true,
})
export class RevealDirective implements OnInit, OnDestroy {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private observer: IntersectionObserver | null = null;

  ngOnInit(): void {
    const element = this.el.nativeElement;
    element.classList.add('reveal');

    // Umbral 0.15 = se dispara cuando el 15% del elemento es visible
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // Dejamos de observar: la animación ocurre una sola vez
            this.observer?.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 },
    );

    this.observer.observe(element);
  }

  ngOnDestroy(): void {
    // Limpieza: evita fugas de memoria al destruir el componente
    this.observer?.disconnect();
  }
}
