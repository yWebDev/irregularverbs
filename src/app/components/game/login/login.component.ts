import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  username = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onSubmit(isValid: boolean | null): void {
    if (!isValid) {
      return;
    }

    this.authService.login(this.username);
    this.router.navigate(['game']);
  }
}
