/**
 * PÁGINA: BANDEJA MULTICANAL PARA TU EQUIPO
 * ------------------------
 * Página hija de funcionalidad con la estructura estándar del sitio:
 * hero interno + beneficios + puntos clave + CTA final.
 * El copy es original, adaptado al mismo modelo de negocio.
 */
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { RevealDirective } from '../../shared/directives/reveal.directive';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [RouterLink, RevealDirective],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {}
