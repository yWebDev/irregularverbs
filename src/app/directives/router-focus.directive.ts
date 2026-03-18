import {
  Directive,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

/**
 * RouterFocusDirective moves focus to the host element after each navigation.
 *
 * Usage: add `appRouterFocus` to the main content container, e.g.
 *   <div id="main-content" appRouterFocus tabindex="-1">
 *
 * This satisfies WCAG 2.4.3 Focus Order and 2.4.1 Bypass Blocks by ensuring
 * that keyboard users always land at the top of new page content after navigation.
 */
@Directive({
  selector: '[appRouterFocus]',
  standalone: true,
})
export class RouterFocusDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef);
  private readonly router = inject(Router);
  private subscription?: Subscription;

  ngOnInit(): void {
    this.subscription = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        setTimeout(() => {
          (this.el.nativeElement as HTMLElement).focus({ preventScroll: false });
        });
      });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
