import { BreakpointObserver } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { map } from 'rxjs/operators';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { AuthService } from './services/auth/auth.service';
import { SeoService } from './services/seo/seo.service';
import { RouterFocusDirective } from './directives/router-focus.directive';
import { BUILD_TIME_ISO, GIT_COMMIT, PACKAGE_VERSION } from './build-info';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageSwitcherComponent } from './components/language-switcher/language-switcher.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    AsyncPipe,
    RouterLink,
    CdkScrollable,
    RouterLinkActive,
    MatMenuTrigger,
    MatIconButton,
    MatIcon,
    MatMenu,
    MatMenuItem,
    RouterOutlet,
    RouterFocusDirective,
    TranslatePipe,
    LanguageSwitcherComponent,
  ],
})
export class AppComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly seoService = inject(SeoService);
  private readonly breakpointObserver = inject(BreakpointObserver);

  readonly username$ = this.authService.username$;

  /** Hamburger + overflow menu below --iv-bp-lg. */
  readonly compactNav = toSignal(
    this.breakpointObserver
      .observe('(max-width: 991.98px)')
      .pipe(map((state) => state.matches)),
    { initialValue: false },
  );

  readonly mobileNavMenuOpen = signal(false);

  /** Shown in the footer; hover/title exposes commit and build time from the esbuild build-info plugin. */
  readonly appVersion = PACKAGE_VERSION;
  readonly buildDetailsTitle = [GIT_COMMIT, BUILD_TIME_ISO].filter(Boolean).join(' · ');

  ngOnInit(): void {
    this.seoService.updateHomePageSEO();
  }

  isCurrentRoute(path: string): boolean {
    if (path === '/') {
      return this.router.url === '/';
    }
    return this.router.url.startsWith(path);
  }

  onDelete(): void {
    this.authService.delete();
    this.router.navigate(['']);
  }

  onMobileNavOpened(): void {
    this.mobileNavMenuOpen.set(true);
  }

  onMobileNavClosed(): void {
    this.mobileNavMenuOpen.set(false);
  }
}
