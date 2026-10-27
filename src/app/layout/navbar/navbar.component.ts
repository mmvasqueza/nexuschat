/**
 * NAVBAR FIJA - NAVEGACIÓN PRINCIPAL
 * ----------------------------------
 * Características:
 *  - Menú de escritorio con dropdown "Funcionalidades" (los 4 módulos).
 *  - Móvil: menú hamburguesa con panel desplegable accesible.
 *  - Se solidifica (fondo opaco + sombra) al hacer scroll > 24px.
 *  - Estado de sesión vía AuthService.isLoggedIn(): muestra "Ir a la app"
 *    cuando el usuario está autenticado.
 *  - Estado activo con routerLinkActive: el enlace de la ruta actual
 *    recibe la clase `active` (subrayado dorado).
 *
 * Conexión: AuthService (sesión) + Router (navegación SPA sin recarga).
 */
import { Component, HostListener, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

interface NavItem {
  label: string;
  link: string;
  children?: NavItem[]; // submenú de funcionalidades
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  protected readonly auth = inject(AuthService);

  /** true cuando la página se desplazó -> navbar con fondo sólido */
  readonly scrolled = signal(false);

  /** Controla la apertura del menú móvil */
  readonly mobileOpen = signal(false);

  /** true mientras el dropdown de funcionalidades está abierto (hover/click) */
  readonly featuresOpen = signal(false);

  /** Estructura de navegación (fuente única para template y menú móvil) */
  readonly navItems: NavItem[] = [
    {
      label: 'Funcionalidades',
      link: '/es/funcionalidades/chat',
      children: [
        { label: 'Bandeja multicanal', link: '/es/funcionalidades/chat' },
        { label: 'Chatbot con IA', link: '/es/funcionalidades/chatbot' },
        { label: 'Campañas masivas', link: '/es/funcionalidades/broadcast' },
        { label: 'API & Webhooks', link: '/es/funcionalidades/api' },
      ],
    },
    { label: 'Precios', link: '/es/precios' },
    { label: 'Preguntas frecuentes', link: '/es/preguntas-frecuentes' },
    { label: 'Demo', link: '/es/demo' },
  ];

  /** Escucha el scroll global y actualiza la señal (throttle implícito por evento) */
  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 24);
  }

  /** Alterna el menú móvil y bloquea el scroll del body cuando está abierto */
  toggleMobile(): void {
    this.mobileOpen.update((v) => !v);
    document.body.style.overflow = this.mobileOpen() ? 'hidden' : '';
  }

  /** Cierra cualquier estado abierto (llamar tras navegar) */
  closeAll(): void {
    this.mobileOpen.set(false);
    this.featuresOpen.set(false);
    document.body.style.overflow = '';
  }
}
