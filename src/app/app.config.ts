import {
  importProvidersFrom,
  inject,
  provideAppInitializer,
  ApplicationConfig,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
  withXsrfConfiguration,
} from '@angular/common/http';
import {
  BrowserModule,
  provideClientHydration,
  withEventReplay,
  withHttpTransferCacheOptions,
} from '@angular/platform-browser';
import routes from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
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
import { provideRouter } from '@angular/router';
import { ConfigService } from './services/config/config.service';
import { PerformanceService } from './services/performance/performance.service';
import { errorInterceptor } from './interceptors/error.interceptor';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { authReducer } from './store/auth/auth.reducer';
import { verbsReducer } from './store/verbs/verbs.reducer';
import { gameReducer } from './store/game/game.reducer';
import { VerbsEffects } from './store/verbs/verbs.effects';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import {
  TranslateHttpLoader,
  TRANSLATE_HTTP_LOADER_CONFIG,
} from '@ngx-translate/http-loader';
import { LanguageInitService } from './services/language/language-init.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection(),
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
    provideStore({
      auth: authReducer,
      verbs: verbsReducer,
      game: gameReducer,
      router: routerReducer,
    }),
    provideEffects([VerbsEffects]),
    provideRouterStore(),
    provideHttpClient(
      withFetch(),
      withInterceptors([errorInterceptor]),
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN',
      }),
    ),
    {
      provide: TRANSLATE_HTTP_LOADER_CONFIG,
      useValue: { prefix: '/assets/i18n/', suffix: '.json' },
    },
    ...provideTranslateService({
      fallbackLang: 'en',
      loader: { provide: TranslateLoader, useClass: TranslateHttpLoader },
    }),
    provideAppInitializer(() => {
      inject(LanguageInitService).init();
    }),
    provideAnimationsAsync(),
    provideAppInitializer(() => {
      inject(ConfigService).loadConfig();
    }),
    provideAppInitializer(() => {
      const performanceService = inject(PerformanceService);
      performanceService.addResourceHints();
      performanceService.optimizeFontLoading();
      performanceService.measurePerformance();
    }),
    provideClientHydration(
      withEventReplay(),
      withHttpTransferCacheOptions({}),
    ),
  ],
};
