import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [FormsModule, MatFormField, MatInput, MatError, MatButton]
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected username = '';

  protected onSubmit(isValid: boolean | null): void {
    if (!isValid) {
      return;
    }

    this.authService.login(this.username);
    this.router.navigate(['game']);
  }
}
