import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

const STORAGE_KEY = 'iverbs.lang';

const SUPPORTED = ['en', 'es', 'uk'] as const;
export type AppLanguage = (typeof SUPPORTED)[number];

@Injectable({ providedIn: 'root' })
export class LanguageInitService {
  private readonly translate = inject(TranslateService);

  init(): void {
    const stored = localStorage.getItem(STORAGE_KEY);
    const lang = (SUPPORTED as readonly string[]).includes(stored ?? '')
      ? (stored as AppLanguage)
      : 'en';
    this.translate.setFallbackLang('en');
    this.translate.use(lang);
    document.documentElement.lang = lang;
    this.translate.onLangChange.subscribe((e) => {
      localStorage.setItem(STORAGE_KEY, e.lang);
      document.documentElement.lang = e.lang;
    });
  }
}
