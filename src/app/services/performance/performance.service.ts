import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { onLCP, onINP, onCLS, onFCP, onTTFB } from 'web-vitals';
import * as Sentry from '@sentry/angular';
import { environment } from '../../../environments/environment';

type MetricRating = 'good' | 'needs-improvement' | 'poor';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  // Preload critical resources
  preloadCriticalResources() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    // Preload critical CSS
    this.preloadResource('/assets/styles/critical.css', 'style');
    
    // Preload critical images
    this.preloadResource('/assets/images/hero-image.jpg', 'image');
    
    // Preload critical fonts
    this.preloadResource('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap', 'style');
  }

  // Preload non-critical resources
  preloadNonCriticalResources() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    // Preload game assets
    this.preloadResource('/assets/images/game-assets.png', 'image');
    
    // Preload verb data
    this.preloadResource('/assets/data/verbs.json', 'fetch');
  }

  private preloadResource(href: string, as: string) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    document.head.appendChild(link);
  }

  // Lazy load images when they come into viewport
  lazyLoadImages() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset.src || '';
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  // Optimize font loading
  optimizeFontLoading() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    // Add font-display: swap to Google Fonts
    const fontLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
    fontLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && !href.includes('&display=swap')) {
        link.setAttribute('href', href + '&display=swap');
      }
    });
  }

  // Measure and report Web Vitals (LCP, INP, CLS, FCP, TTFB)
  measurePerformance() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const reportMetric = (metric: { name: string; value: number; id?: string; rating?: MetricRating; delta?: number; navigationType?: string }) => {
      if (environment.sentryDsn) {
        const SentryWithMetrics = Sentry as typeof Sentry & { metrics?: { distribution: (name: string, value: number, unit?: string) => void } };
        if (SentryWithMetrics.metrics?.distribution) {
          SentryWithMetrics.metrics.distribution(`web_vitals.${metric.name.toLowerCase()}`, metric.value);
        } else {
          Sentry.addBreadcrumb({ category: 'web-vitals', message: `${metric.name}: ${metric.value}`, data: metric });
        }
      }
      this.http.post('/api/metrics', metric).subscribe({ error: () => { /* silently ignore metric delivery failures */ } });
    };

    onLCP(reportMetric as (m: unknown) => void);
    onINP(reportMetric as (m: unknown) => void);
    onCLS(reportMetric as (m: unknown) => void);
    onFCP(reportMetric as (m: unknown) => void);
    onTTFB(reportMetric as (m: unknown) => void);
  }

  // Implement resource hints
  addResourceHints() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    // DNS prefetch for external domains
    this.addResourceHint('https://fonts.googleapis.com', 'dns-prefetch');
    this.addResourceHint('https://pagead2.googlesyndication.com', 'dns-prefetch');
    
    // Preconnect to critical domains
    this.addResourceHint('https://fonts.googleapis.com', 'preconnect');
    this.addResourceHint('https://pagead2.googlesyndication.com', 'preconnect');
  }

  private addResourceHint(href: string, rel: string) {
    const link = document.createElement('link');
    link.rel = rel;
    link.href = href;
    document.head.appendChild(link);
  }
}
