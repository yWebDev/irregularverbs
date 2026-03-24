import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { AuthService } from './services/auth/auth.service';
import { SeoService } from './services/seo/seo.service';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
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

  readonly username$ = this.authService.username$;

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
}
