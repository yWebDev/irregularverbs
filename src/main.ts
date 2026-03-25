import { enableProdMode, inject, provideAppInitializer } from '@angular/core';
import { ErrorHandler } from '@angular/core';
import { environment } from './environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import * as Sentry from '@sentry/angular';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

const isBrowser = typeof window !== 'undefined';

if (environment.sentryDsn && isBrowser) {
  Sentry.init({
    dsn: environment.sentryDsn,
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    environment: environment.production ? 'production' : 'development',
  });

  void Sentry.lazyLoadIntegration('replayIntegration').then(
    (replayIntegration) => {
      Sentry.addIntegration(replayIntegration());
    },
  );
}

if (environment.production) {
  enableProdMode();
}

void (async () => {
  const storeDevtoolsProviders = environment.production
    ? []
    : [
        (await import('@ngrx/store-devtools')).provideStoreDevtools({
          maxAge: 25,
          logOnly: false,
          autoPause: true,
          name: 'iVerbs NgRx Store',
        }),
      ];

  const sentryProviders =
    environment.sentryDsn && isBrowser
      ? [
          { provide: ErrorHandler, useValue: Sentry.createErrorHandler() },
          Sentry.TraceService,
          provideAppInitializer(() => {
            inject(Sentry.TraceService);
          }),
        ]
      : [];

  await bootstrapApplication(AppComponent, {
    providers: [
      ...appConfig.providers,
      ...sentryProviders,
      ...storeDevtoolsProviders,
    ],
  });
})().catch((err) => console.error(err));
