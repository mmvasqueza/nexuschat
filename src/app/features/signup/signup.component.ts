/**
 * PÁGINA: CREA UNA CUENTA GRATUITA (/es/crea-una-cuenta-gratuita)
 * ---------------------------------------------------------------
 * Réplica del flujo de registro del sitio de referencia:
 *  - Formulario: email de trabajo + empresa + contraseña.
 *  - "o" -> registro con Google/SSO (botones sociales, mock).
 *  - Al enviar: AuthService.signup() simula el email de activación
 *    ("Recibirás un correo para completar la configuración en pocos segundos").
 *  - Panel derecho: beneficios (configuración en 3 minutos, widget gratis,
 *    soporte 24/7) + descargas de apps (Android, iOS, Windows, macOS).
 *
 * Formularios: ReactiveForms con validadores (email, required, minLength)
 * y mensajes de error accesibles asociados con aria-describedby.
 */
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);

  /** true mientras se procesa el registro (deshabilita el botón) */
  readonly loading = signal(false);

  /** Mensaje de éxito tras el "envío" del email de activación */
  readonly success = signal<string | null>(null);

  /** Error de servidor (simulado) */
  readonly error = signal<string | null>(null);

  /**
   * Formulario reactivo tipado. En Angular 22 también existen Signal Forms
   * (estables desde v22); Reactive Forms se mantiene para interoperabilidad
   * con validadores y librerías existentes. Migración sencilla cuando el
   * equipo lo decida (ver README).
   */
  readonly form = this.fb.group({
    workEmail: ['', [Validators.required, Validators.email]],
    company: ['', [Validators.required, Validators.minLength(2)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    // Aceptación de términos (checkbox requerido true)
    terms: [false, Validators.requiredTrue],
  });

  /**
   * Envía el registro. Marca todos los campos como tocados para que
   * aparezcan los errores, y solo llama al servicio si el form es válido.
   */
  async onSubmit(): Promise<void> {
    this.form.markAllAsTouched();
    this.error.set(null);
    if (this.form.invalid) return;

    this.loading.set(true);
    try {
      await this.auth.signup({
        workEmail: this.form.value.workEmail!,
        company: this.form.value.company!,
        password: this.form.value.password!,
      });
      // Flujo de activación por email (réplica del original)
      this.success.set(
        `Te hemos enviado un correo a ${this.form.value.workEmail} para completar la configuración en pocos segundos.`,
      );
      this.form.reset();
    } catch {
      this.error.set('No pudimos crear tu cuenta. Inténtalo de nuevo.');
    } finally {
      this.loading.set(false);
    }
  }

  /** Registro social (mock): en producción redirige al OAuth del IdP */
  socialSignup(provider: 'google' | 'microsoft'): void {
    console.info(`[Signup] OAuth con ${provider} (configurar en backend)`);
    this.error.set(`El registro con ${provider} se habilita al conectar el backend de autenticación.`);
  }
}
