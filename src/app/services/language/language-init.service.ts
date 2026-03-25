import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

const STORAGE_KEY = 'iverbs.lang';

const SUPPORTED = ['en', 'es', 'uk'] as const;
export type AppLanguage = (typeof SUPPORTED)[number];

@Injectable({ providedIn: 'root' })
export class LanguageInitService {
  private readonly translate = inject(TranslateService);
  private readonly platformId = inject(PLATFORM_ID);

  init(): void {
    const stored = isPlatformBrowser(this.platformId)
      ? localStorage.getItem(STORAGE_KEY)
      : null;
    const lang = (SUPPORTED as readonly string[]).includes(stored ?? '')
      ? (stored as AppLanguage)
      : 'en';
    this.translate.setFallbackLang('en');
    this.translate.use(lang);
    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.lang = lang;
      this.translate.onLangChange.subscribe((e) => {
        localStorage.setItem(STORAGE_KEY, e.lang);
        document.documentElement.lang = e.lang;
      });
    }
  }
}
