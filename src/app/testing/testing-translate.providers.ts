import {
  EnvironmentProviders,
  inject,
  provideAppInitializer,
  Provider,
} from '@angular/core';
import {
  provideTranslateService,
  TranslateLoader,
  TranslateNoOpLoader,
  TranslateService,
  TranslationObject,
} from '@ngx-translate/core';
import en from '../../assets/i18n/en.json';

/**
 * Synchronous translations for unit tests: `TranslatePipe`/`instant` work on first CD
 * (HTTP loader alone resolves too late for some `attr.aria-label` bindings).
 */
export const testingTranslateProviders: (Provider | EnvironmentProviders)[] = [
  ...provideTranslateService({
    fallbackLang: 'en',
    lang: 'en',
    loader: { provide: TranslateLoader, useClass: TranslateNoOpLoader },
  }),
  provideAppInitializer(() => {
    const translate = inject(TranslateService);
    translate.setTranslation('en', en as TranslationObject, true);
    translate.setFallbackLang('en');
    translate.use('en');
  }),
];
