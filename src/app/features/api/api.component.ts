/**
 * PÁGINA: API & WEBHOOKS PARA TUS SISTEMAS
 * ------------------------
 * Página hija de funcionalidad con la estructura estándar del sitio:
 * hero interno + beneficios + puntos clave + CTA final.
 * El copy es original, adaptado al mismo modelo de negocio.
 */
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { RevealDirective } from '../../shared/directives/reveal.directive';

@Component({
  selector: 'app-api',
  standalone: true,
  imports: [RouterLink, RevealDirective],
  templateUrl: './api.component.html',
  styleUrl: './api.component.scss',
})
export class ApiComponent {}
