/**
 * COMPONENTE RAÍZ
 * ----------------
 * Define el esqueleto persistente de la app: navbar fijo, zona de
 * contenido con <router-outlet> (aquí Angular inserta cada página
 * lazy-loaded) y footer. El botón flotante de WhatsApp flota sobre todo.
 *
 * SeoService.init() se ejecuta una vez al arrancar para sincronizar
 * los <title> y meta tags en cada navegación.
 */
import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NavbarComponent } from './layout/navbar/navbar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { FloatingCtaComponent } from './layout/floating-cta/floating-cta.component';
import { SeoService } from './core/services/seo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  // Importaciones standalone: sin NgModules, cada componente declara
  // exactamente lo que usa.
  imports: [RouterOutlet, NavbarComponent, FooterComponent, FloatingCtaComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    // Activa la suscripción a eventos de navegación para SEO
    this.seo.init();
  }
}
