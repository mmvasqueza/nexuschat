/**
 * CONFIGURACIÓN GLOBAL DE LA APLICACIÓN
 * -----------------------------------
 * Punto único donde se registran los proveedores (providers) de Angular:
 *
 *  - provideZonelessChangeDetection(): Angular 22 sin Zone.js. La reactividad
 *    la manejan las Signals; esto reduce ~30KB de bundle y evita parches
 *    al motor asincrónico del navegador (zone.js).
 *  - provideRouter(): enrutamiento con precarga lazy de módulos de página.
 *  - provideHttpClient(withFetch()): cliente HTTP basado en fetch, ideal
 *    para SSR/hidratación y compatibilidad futura.
 *  - provideAnimationsAsync(): animaciones cargadas de forma diferida.
 *
 * Cómo se conecta: main.ts -> appConfig -> todos los componentes y
 * servicios inyectan estas capacidades vía `inject()`.
 */
import {
  ApplicationConfig,
  provideZonelessChangeDetection,
} from '@angular/core';
import {
  provideRouter,
  withInMemoryScrolling,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Detección de cambios sin Zone.js (estándar en Angular 21+)
    provideZonelessChangeDetection(),

    // Router con scroll restaurado y precarga de rutas diferidas
    provideRouter(
      routes,
      // Al navegar con anchor (#seccion), desplaza suavemente y compensa header
      withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' }),
      // Precarga en segundo plano los chunks lazy tras el primer render,
      // así las siguientes páginas cargan instantáneamente.
      withPreloading(PreloadAllModules),
    ),

    // HttpClient moderno basado en fetch API
    provideHttpClient(withFetch()),

    // Animaciones cargadas bajo demanda (no bloquean el primer pintado)
    provideAnimationsAsync(),
  ],
};
