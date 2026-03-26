import {
  AfterViewInit,
  Directive,
  ElementRef,
  inject,
  OnDestroy,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Adds `iv-scroll-reveal--visible` when the host scrolls into view (IntersectionObserver).
 */
@Directive({
  selector: '[appScrollReveal]',
  host: {
    class: 'iv-scroll-reveal',
  },
})
export class ScrollRevealDirective implements AfterViewInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly platformId = inject(PLATFORM_ID);
  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('iv-scroll-reveal--visible');
          }
        }
      },
      { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.06 },
    );
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
