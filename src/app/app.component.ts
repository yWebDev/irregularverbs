import { Component } from '@angular/core';
import { VerbDetails } from './model/verb-details';
import { AuthService } from './services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  get username(): string | null {
    return this.authService.username;
  };

  constructor(private authService: AuthService, private router: Router) {}

  onDelete(): void {
    this.authService.delete();
    this.router.navigate(['']);
  }
}
