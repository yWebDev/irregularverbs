import {
  enableProdMode,
  importProvidersFrom,
  inject,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { ErrorHandler } from '@angular/core';
import { environment } from './environments/environment';
import {
  provideHttpClient,
  withInterceptors,
  withXsrfConfiguration,
} from '@angular/common/http';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import routes from './app/app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { A11yModule } from '@angular/cdk/a11y';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import * as Sentry from '@sentry/angular';
import { ConfigService } from './app/services/config/config.service';
import { PerformanceService } from './app/services/performance/performance.service';
import { errorInterceptor } from './app/interceptors/error.interceptor';

if (environment.sentryDsn) {
  Sentry.init({
    dsn: environment.sentryDsn,
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    environment: environment.production ? 'production' : 'development',
  });

  Sentry.lazyLoadIntegration('replayIntegration').then((replayIntegration) => {
    Sentry.addIntegration(replayIntegration());
  });
}

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),
    ...(environment.sentryDsn
      ? [
        { provide: ErrorHandler, useValue: Sentry.createErrorHandler() },
        Sentry.TraceService,
        provideAppInitializer(() => { inject(Sentry.TraceService); }),
      ]
      : []),
    importProvidersFrom(
      BrowserModule,
      FormsModule,
      ReactiveFormsModule,
      MatAutocompleteModule,
      MatInputModule,
      MatButtonModule,
      MatIconModule,
      DragDropModule,
      A11yModule,
      MatMenuModule,
      MatSnackBarModule,
      MatDialogModule,
    ),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([errorInterceptor]),
      withXsrfConfiguration({ cookieName: 'XSRF-TOKEN', headerName: 'X-XSRF-TOKEN' }),
    ),
    provideAnimations(),
    provideAppInitializer(() => {
      const configService = inject(ConfigService);
      configService.loadConfig();
    }),
    provideAppInitializer(() => {
      const performanceService = inject(PerformanceService);
      // Initialize performance optimizations
      performanceService.addResourceHints();
      performanceService.optimizeFontLoading();
      performanceService.measurePerformance();
    }),
  ],
}).catch((err) => console.error(err));
