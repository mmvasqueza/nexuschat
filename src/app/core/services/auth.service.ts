/**
 * SERVICIO DE AUTENTICACIÓN (simulado para el frontend)
 * ------------------------------------------------------
 * En producción este servicio delegaría en el backend real:
 *   POST /api/auth/register  -> crea cuenta y envía email de confirmación
 *   POST /api/auth/login     -> devuelve JWT (access + refresh token)
 *
 * Aquí se implementa el flujo con señales para demostrar la arquitectura:
 * el Navbar lee `isLoggedIn()` para cambiar "Crear cuenta" por "Ir a la app",
 * y guards futuros podrían usar `requireAuth`.
 *
 * Seguridad en producción: el JWT debe almacenarse en cookie HttpOnly
 * (no en localStorage) para mitigar XSS, y renovarse con refresh tokens
 * rotativos. Ver backend-dotnet/ para el ejemplo completo.
 */
import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/** Datos mínimos del registro de cuenta gratuita */
export interface SignupPayload {
  workEmail: string;
  company: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  /** Token de sesión en memoria (signal). null = no autenticado. */
  private readonly token = signal<string | null>(null);

  /** Usuario actual derivado del token (en demo usamos email genérico) */
  readonly currentUser = computed(() =>
    this.token() ? { email: 'usuario@empresa.com', plan: 'trial' } : null,
  );

  /** true si hay sesión activa (usado por el navbar y guards) */
  readonly isLoggedIn = computed(() => this.token() !== null);

  /**
   * Registro de cuenta gratuita (réplica de /es/crea-una-cuenta-gratuita).
   * En producción: POST al backend, que envía el email de confirmación.
   * Aquí simulamos latencia y éxito para permitir desarrollo sin backend.
   */
  async signup(payload: SignupPayload): Promise<void> {
    await this.fakeDelay(900);
    // Simula el email de activación: "Recibirás un correo para completar
    // la configuración en pocos segundos" (flujo del sitio original).
    console.info('[AuthService] Email de activación enviado a', payload.workEmail);
    this.token.set('demo-token-' + Date.now());
  }

  /** Login con email + contraseña (simulado) */
  async login(email: string, password: string): Promise<void> {
    await this.fakeDelay(700);
    this.token.set('demo-token-' + Date.now());
  }

  /** Cierra sesión y limpia el estado reactivo */
  logout(): void {
    this.token.set(null);
  }

  /** Utilidad: espera `ms` milisegundos (para simular red en demo) */
  private fakeDelay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
