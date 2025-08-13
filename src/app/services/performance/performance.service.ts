import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {

  constructor() { }

  // Preload critical resources
  preloadCriticalResources() {
    // Preload critical CSS
    this.preloadResource('/assets/styles/critical.css', 'style');
    
    // Preload critical images
    this.preloadResource('/assets/images/hero-image.jpg', 'image');
    
    // Preload critical fonts
    this.preloadResource('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap', 'style');
  }

  // Preload non-critical resources
  preloadNonCriticalResources() {
    // Preload game assets
    this.preloadResource('/assets/images/game-assets.png', 'image');
    
    // Preload verb data
    this.preloadResource('/assets/data/verbs.json', 'fetch');
  }

  private preloadResource(href: string, as: string) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as as any;
    document.head.appendChild(link);
  }

  // Lazy load images when they come into viewport
  lazyLoadImages() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
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
    // Add font-display: swap to Google Fonts
    const fontLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
    fontLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && !href.includes('&display=swap')) {
        link.setAttribute('href', href + '&display=swap');
      }
    });
  }

  // Measure and log performance metrics
  measurePerformance() {
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          const paint = performance.getEntriesByType('paint');
          
          console.log('Performance Metrics:', {
            'DOM Content Loaded': navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            'Load Complete': navigation.loadEventEnd - navigation.loadEventStart,
            'First Paint': paint.find(p => p.name === 'first-paint')?.startTime,
            'First Contentful Paint': paint.find(p => p.name === 'first-contentful-paint')?.startTime
          });
        }, 0);
      });
    }
  }

  // Implement resource hints
  addResourceHints() {
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
