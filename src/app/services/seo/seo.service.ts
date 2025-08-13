import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MetaService, SEOData } from '../meta/meta.service';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private defaultSEO: SEOData = {
    title: 'Irregular Verbs - Comprehensive Table with AI Examples & Games',
    description: 'Master English irregular verbs with our comprehensive table featuring AI-generated examples. Practice with interactive games, explore verb forms, and improve your English vocabulary with detailed verb conjugations and usage examples.',
    keywords: 'irregular verbs table, AI examples, English grammar, verb conjugation, English learning, ESL practice, comprehensive verb list, AI-generated examples, English verbs, language learning',
    url: 'https://iverbs.info',
    type: 'website'
  };

  constructor(
    private metaService: MetaService,
    private router: Router
  ) {
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
    const currentUrl = this.router.url;
    
    switch (currentUrl) {
      case '/':
        this.updateHomePageSEO();
        break;
      case '/game':
        this.updateGamePageSEO();
        break;
      case '/verbs':
        this.updateVerbsPageSEO();
        break;
      default:
        this.updateDefaultSEO();
    }
  }

  updateHomePageSEO() {
    const seoData: SEOData = {
      title: 'Irregular Verbs - Comprehensive Table with AI Examples & Games',
      description: 'Master English irregular verbs with our comprehensive table featuring AI-generated examples. Practice with interactive games, explore verb forms, and improve your English vocabulary with detailed verb conjugations and usage examples.',
      keywords: 'irregular verbs table, AI examples, English grammar, verb conjugation, English learning, ESL practice, comprehensive verb list, AI-generated examples, English verbs, language learning, verb usage examples',
      url: 'https://iverbs.info',
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
      url: 'https://iverbs.info/game',
      type: 'website'
    };

    this.metaService.updateMeta(seoData);
    this.updateGamePageStructuredData();
  }

  updateVerbsPageSEO() {
    const seoData: SEOData = {
      title: 'Comprehensive Irregular Verbs Table with AI Examples',
      description: 'Explore our comprehensive irregular verbs table featuring AI-generated examples for each verb. See base form, past simple, past participle, and detailed usage examples with AI-powered explanations. Perfect for students, teachers, and ESL learners.',
      keywords: 'irregular verbs table, AI examples, comprehensive verb list, English verb forms, verb conjugation, past simple, past participle, AI-generated examples, English grammar reference, ESL resources, verb usage examples, AI-powered learning',
      url: 'https://iverbs.info/verbs',
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
      "url": "https://iverbs.info",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://iverbs.info?search={search_term_string}",
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
      "url": "https://iverbs.info/game",
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
      "url": "https://iverbs.info/verbs",
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
