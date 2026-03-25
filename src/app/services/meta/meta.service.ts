import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';

export interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

@Injectable({
  providedIn: 'root',
})
export class MetaService {
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);
  private readonly document = inject(DOCUMENT);

  private readonly defaultImage = '/assets/images/irregular-verbs-seo.jpg';
  private readonly defaultUrl = environment.siteUrl;

  updateMeta(seoData: SEOData) {
    const {
      title,
      description,
      keywords,
      image = this.defaultImage,
      url = this.defaultUrl,
      type = 'website',
      author = 'Irregular Verbs',
      publishedTime,
      modifiedTime
    } = seoData;

    const absoluteImage = this.toAbsoluteUrl(image, url);

    // Basic meta tags
    this.titleService.setTitle(title);
    this.metaService.updateTag({ name: 'description', content: description });
    
    if (keywords) {
      this.metaService.updateTag({ name: 'keywords', content: keywords });
    }

    // Open Graph tags
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:image', content: absoluteImage });
    this.metaService.updateTag({ property: 'og:url', content: url });
    this.metaService.updateTag({ property: 'og:type', content: type });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Irregular Verbs' });

    // Twitter Card tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: title });
    this.metaService.updateTag({ name: 'twitter:description', content: description });
    this.metaService.updateTag({ name: 'twitter:image', content: absoluteImage });

    // Additional meta tags
    this.metaService.updateTag({ name: 'author', content: author });
    
    if (publishedTime) {
      this.metaService.updateTag({ property: 'article:published_time', content: publishedTime });
    }
    
    if (modifiedTime) {
      this.metaService.updateTag({ property: 'article:modified_time', content: modifiedTime });
    }

    this.setCanonicalLink(url);
  }

  /** Resolves asset paths to absolute URLs for og:image / Twitter (validators require absolute URLs). */
  private toAbsoluteUrl(imageOrUrl: string, pageCanonicalUrl: string): string {
    if (imageOrUrl.startsWith('http://') || imageOrUrl.startsWith('https://')) {
      return imageOrUrl;
    }
    try {
      const origin = new URL(pageCanonicalUrl).origin;
      const path = imageOrUrl.startsWith('/') ? imageOrUrl : `/${imageOrUrl}`;
      return `${origin}${path}`;
    } catch {
      const base = environment.siteUrl.replace(/\/$/, '');
      const path = imageOrUrl.startsWith('/') ? imageOrUrl : `/${imageOrUrl}`;
      return `${base}${path}`;
    }
  }

  private setCanonicalLink(href: string): void {
    const head = this.document.head;
    let link = head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      head.appendChild(link);
    }
    link.setAttribute('href', href);
  }

  updateStructuredData(data: Record<string, unknown>) {
    // Remove existing structured data
    const existingScript = this.document.querySelector(
      'script[type="application/ld+json"]',
    );
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data
    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    this.document.head.appendChild(script);
  }

  clearMeta() {
    this.document.querySelector('link[rel="canonical"]')?.remove();

    // Clear Open Graph tags
    this.metaService.removeTag('property="og:title"');
    this.metaService.removeTag('property="og:description"');
    this.metaService.removeTag('property="og:image"');
    this.metaService.removeTag('property="og:url"');
    this.metaService.removeTag('property="og:type"');
    this.metaService.removeTag('property="og:site_name"');

    // Clear Twitter tags
    this.metaService.removeTag('name="twitter:card"');
    this.metaService.removeTag('name="twitter:title"');
    this.metaService.removeTag('name="twitter:description"');
    this.metaService.removeTag('name="twitter:image"');
    this.metaService.removeTag('property="og:image"');

    // Clear other meta tags
    this.metaService.removeTag('name="keywords"');
    this.metaService.removeTag('name="author"');
  }
}
