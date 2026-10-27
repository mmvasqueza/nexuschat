/**
 * PÁGINA: DEMO (/es/demo)
 * -----------------------
 * Captación de leads B2B: formulario para agendar una demostración
 * comercial. Réplica del bloque "Programa una demo con nuestro equipo"
 * (equipo en Europa y Latinoamérica, disponible en tu franja horaria).
 */
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './demo.component.html',
  styleUrl: './demo.component.scss',
})
export class DemoComponent {
  private readonly fb = new FormBuilder();

  readonly loading = signal(false);
  readonly sent = signal(false);

  readonly form = this.fb.group({
    name: ['', Validators.required],
    workEmail: ['', [Validators.required, Validators.email]],
    company: ['', Validators.required],
    teamSize: ['3-10'],
    message: [''],
  });

  async onSubmit(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.loading.set(true);
    await new Promise((r) => setTimeout(r, 900)); // envío simulado
    this.loading.set(false);
    this.sent.set(true);
  }
}
