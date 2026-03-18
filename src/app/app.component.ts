import { Component, inject, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    RouterLink,
    CdkScrollable,
    RouterLinkActive,
    MatMenuTrigger,
    MatIcon,
    MatMenu,
    MatMenuItem,
    RouterOutlet,
    RouterFocusDirective,
  ],
})
export class AppComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly seoService = inject(SeoService);

  ngOnInit(): void {
    this.seoService.updateHomePageSEO();
  }

  get username(): string | null {
    return this.authService.username;
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
