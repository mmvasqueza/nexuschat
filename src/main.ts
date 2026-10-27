/**
 * PUNTO DE ENTRADA DE LA APLICACIÓN
 * ----------------------------
 * Angular 22 arranca en modo "zoneless" (sin Zone.js): la detección de
 * cambios la conducen las Signals y los eventos del framework, lo que
 * reduce el peso del bundle y mejora el rendimiento.
 *
 * Flujo: main.ts -> bootstrapApplication(AppComponent, appConfig)
 *       -> appConfig registra el Router con rutas lazy-loaded
 *       -> AppComponent renderiza <router-outlet> dentro del layout.
 */
import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

// Arranca la aplicación raíz con la configuración centralizada.
bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error('Error al arrancar NexusChat:', err),
);
