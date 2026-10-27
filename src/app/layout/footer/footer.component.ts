/**
 * FOOTER CORPORATIVO
 * ------------------
 * Réplica de estructura: 4 columnas (producto, funcionalidades,
 * recursos, empresa/legal) + barra inferior con copyright y selector
 * de idioma decorativo. Los enlés internos usan routerLink (SPA).
 */
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  readonly year = new Date().getFullYear();
}
