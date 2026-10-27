/**
 * SERVICIO SEO
 * ------------
 * Actualiza <title> y <meta name="description"> en cada navegación.
 * Escucha los eventos del Router y lee los datos de la ruta activa
 * (configurados en app.routes.ts bajo la clave `data.seo`).
 *
 * Conexión: app.routes.ts (define títulos) -> SeoService (aplica al DOM)
 * -> buscadores y redes sociales leen las etiquetas actualizadas.
 */
import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  /** Suscribe al stream de navegación una sola vez (app singleton) */
  init(): void {
    this.router.events
      .pipe(
        // Solo nos interesa cuando la navegación terminó con éxito
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        // Busca la ruta hoja (la última con data.seo) para leer su título
        map(() => {
          let current: ActivatedRoute = this.route;
          while (current.firstChild) {
            current = current.firstChild;
          }
          return current.snapshot.data?.['seo'] as { title?: string } | undefined;
        }),
      )
      .subscribe((seo) => {
        if (seo?.title) {
          this.title.setTitle(seo.title);
          this.meta.updateTag({ name: 'twitter:title', content: seo.title });
          this.meta.updateTag({ property: 'og:title', content: seo.title });
        }
      });
  }
}
