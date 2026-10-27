/**
 * PÁGINA: CHATBOT AVANZADO CON IA
 * ------------------------
 * Página hija de funcionalidad con la estructura estándar del sitio:
 * hero interno + beneficios + puntos clave + CTA final.
 * El copy es original, adaptado al mismo modelo de negocio.
 */
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { RevealDirective } from '../../shared/directives/reveal.directive';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [RouterLink, RevealDirective],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.scss',
})
export class ChatbotComponent {}
