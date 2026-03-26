import { inject, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { MetaService, SEOData } from '../meta/meta.service';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private readonly metaService = inject(MetaService);
  private readonly router = inject(Router);

  private readonly siteUrl = environment.siteUrl.replace(/\/$/, '');

  private defaultSEO: SEOData = {
    title: 'Irregular Verbs - Comprehensive Table with AI Examples & Games',
    description: 'Master English irregular verbs with our comprehensive table featuring AI-generated examples. Practice with interactive games, explore verb forms, and improve your English vocabulary with detailed verb conjugations and usage examples.',
    keywords: 'irregular verbs table, AI examples, English grammar, verb conjugation, English learning, ESL practice, comprehensive verb list, AI-generated examples, English verbs, language learning',
    url: this.siteUrl + '/',
    type: 'website'
  };

  constructor() {
    this.initializeRouterListener();
  }

  private initializeRouterListener() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updatePageSEO();
    });
  }

  private updatePageSEO() {
    const path = this.currentPath();

    switch (path) {
      case '/':
        this.updateHomePageSEO();
        break;
      case '/game':
        this.updateGamePageSEO();
        break;
      case '/verbs':
        this.updateVerbsPageSEO();
        break;
      case '/stats':
        this.updateStatsPageSEO();
        break;
      default:
        this.updateDefaultSEO();
    }
  }

  /** Path only (no query or hash) so canonical/SEO match the real route. */
  private currentPath(): string {
    const raw = this.router.url.split('#')[0].split('?')[0];
    return raw === '' ? '/' : raw;
  }

  updateHomePageSEO() {
    const seoData: SEOData = {
      title: 'Irregular Verbs - Comprehensive Table with AI Examples & Games',
      description: 'Master English irregular verbs with our comprehensive table featuring AI-generated examples. Practice with interactive games, explore verb forms, and improve your English vocabulary with detailed verb conjugations and usage examples.',
      keywords: 'irregular verbs table, AI examples, English grammar, verb conjugation, English learning, ESL practice, comprehensive verb list, AI-generated examples, English verbs, language learning, verb usage examples',
      url: `${this.siteUrl}/`,
      type: 'website'
    };

    this.metaService.updateMeta(seoData);
    this.updateHomePageStructuredData();
  }

  updateGamePageSEO() {
    const seoData: SEOData = {
      title: 'Irregular Verbs Game - Practice with AI Examples & Fun Games',
      description: 'Play interactive games to learn and practice English irregular verbs with AI-generated examples. Test your knowledge with fun challenges and improve your English skills using our comprehensive verb database.',
      keywords: 'irregular verbs game, AI examples, English verb games, ESL games, English learning games, verb practice games, English vocabulary games, AI-generated examples',
      url: `${this.siteUrl}/game`,
      type: 'website'
    };

    this.metaService.updateMeta(seoData);
    this.updateGamePageStructuredData();
  }

  updateStatsPageSEO() {
    const seoData: SEOData = {
      title: 'Learning Statistics — Irregular Verbs',
      description:
        'View your game score history, verb pattern distribution, and learning progress charts. Track practice sessions and explore how irregular verbs group by form pattern.',
      keywords:
        'irregular verbs statistics, learning progress, verb patterns, ESL progress, English learning charts, game scores',
      url: `${this.siteUrl}/stats`,
      type: 'website',
    };

    this.metaService.updateMeta(seoData);
  }

  updateVerbsPageSEO() {
    const seoData: SEOData = {
      title: 'Comprehensive Irregular Verbs Table with AI Examples',
      description: 'Explore our comprehensive irregular verbs table featuring AI-generated examples for each verb. See base form, past simple, past participle, and detailed usage examples with AI-powered explanations. Perfect for students, teachers, and ESL learners.',
      keywords: 'irregular verbs table, AI examples, comprehensive verb list, English verb forms, verb conjugation, past simple, past participle, AI-generated examples, English grammar reference, ESL resources, verb usage examples, AI-powered learning',
      url: `${this.siteUrl}/verbs`,
      type: 'website'
    };

    this.metaService.updateMeta(seoData);
    this.updateVerbsPageStructuredData();
  }

  updateDefaultSEO() {
    this.metaService.updateMeta(this.defaultSEO);
  }

  private updateHomePageStructuredData() {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Irregular Verbs",
      "description": "Master English irregular verbs with our comprehensive table featuring AI-generated examples. Practice with interactive games, explore verb forms, and improve your English vocabulary with detailed verb conjugations and usage examples.",
      "url": this.siteUrl + "/",
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${this.siteUrl}/?search={search_term_string}`,
        "query-input": "required name=search_term_string"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Irregular Verbs"
      },
      "featureList": [
        "Comprehensive irregular verbs table",
        "AI-generated examples for each verb",
        "Interactive learning games",
        "Verb conjugation practice",
        "Detailed usage examples"
      ]
    };
    this.metaService.updateStructuredData(structuredData);
  }

  private updateGamePageStructuredData() {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Irregular Verbs Game",
      "description": "Interactive games to learn and practice English irregular verbs with AI-generated examples",
      "url": `${this.siteUrl}/game`,
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "Web Browser"
    };
    this.metaService.updateStructuredData(structuredData);
  }

  private updateVerbsPageStructuredData() {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Comprehensive Irregular Verbs Table with AI Examples",
      "description": "Complete list of English irregular verbs with all forms and AI-generated usage examples",
      "url": `${this.siteUrl}/verbs`,
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Irregular Verbs Table with AI Examples"
        }
      ]
    };
    this.metaService.updateStructuredData(structuredData);
  }

  // Method to update SEO for specific components
  updateComponentSEO(seoData: SEOData) {
    this.metaService.updateMeta(seoData);
  }

  // Method to clear all SEO data
  clearSEO() {
    this.metaService.clearMeta();
  }
}
