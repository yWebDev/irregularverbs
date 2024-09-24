import { Component } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    CdkScrollable,
    RouterLinkActive,
    MatMenuTrigger,
    MatIcon,
    MatMenu,
    MatMenuItem,
    RouterOutlet,
  ],
})
export class AppComponent {
  get username(): string | null {
    return this.authService.username;
  }

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onDelete(): void {
    this.authService.delete();
    this.router.navigate(['']);
  }
}
