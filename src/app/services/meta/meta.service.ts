import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Meta } from '@angular/platform-browser';

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
  private defaultImage = '/assets/images/irregular-verbs-seo.jpg';
  private defaultUrl = 'https://iverbs.info';

  constructor(
    private titleService: Title,
    private metaService: Meta,
  ) {}

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

    // Basic meta tags
    this.titleService.setTitle(title);
    this.metaService.updateTag({ name: 'description', content: description });
    
    if (keywords) {
      this.metaService.updateTag({ name: 'keywords', content: keywords });
    }

    // Open Graph tags
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:image', content: image });
    this.metaService.updateTag({ property: 'og:url', content: url });
    this.metaService.updateTag({ property: 'og:type', content: type });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Irregular Verbs' });

    // Twitter Card tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: title });
    this.metaService.updateTag({ name: 'twitter:description', content: description });
    this.metaService.updateTag({ name: 'twitter:image', content: image });

    // Additional meta tags
    this.metaService.updateTag({ name: 'author', content: author });
    
    if (publishedTime) {
      this.metaService.updateTag({ property: 'article:published_time', content: publishedTime });
    }
    
    if (modifiedTime) {
      this.metaService.updateTag({ property: 'article:modified_time', content: modifiedTime });
    }

    // Canonical URL
    this.metaService.updateTag({ rel: 'canonical', href: url });
  }

  updateStructuredData(data: any) {
    // Remove existing structured data
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    document.head.appendChild(script);
  }

  clearMeta() {
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

    // Clear other meta tags
    this.metaService.removeTag('name="keywords"');
    this.metaService.removeTag('name="author"');
  }
}
