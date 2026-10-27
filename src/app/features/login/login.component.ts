/**
 * PÁGINA: INICIAR SESIÓN (/es/iniciar-sesion)
 * -------------------------------------------
 * Formulario de acceso con Reactive Forms. Al autenticar, AuthService
 * actualiza su signal y el navbar reacciona mostrando "Ir a la app".
 */
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  async onSubmit(): Promise<void> {
    this.form.markAllAsTouched();
    this.error.set(null);
    if (this.form.invalid) return;

    this.loading.set(true);
    try {
      await this.auth.login(this.form.value.email!, this.form.value.password!);
      // En producción: redirigir al dashboard con Router.navigateByUrl
    } catch {
      this.error.set('Credenciales incorrectas. Inténtalo de nuevo.');
    } finally {
      this.loading.set(false);
    }
  }
}
