import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MetaService } from 'src/app/services/meta/meta.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [ReactiveFormsModule, MatFormField, MatInput, MatError, MatButton, TranslatePipe],
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly metaService = inject(MetaService);
  private readonly fb = inject(FormBuilder);

  protected readonly loginForm = this.fb.nonNullable.group({
    username: [
      '',
      [Validators.required, Validators.minLength(6), Validators.pattern(/^[0-9A-Za-z]*$/)],
    ],
  });

  constructor() {
    this.metaService.updateMeta({
      title: 'Choose your username',
      description: 'Please choose your username',
      keywords: 'login, username, irregular verbs game',
      url: 'https://irregverbs-1381.uc.r.appspot.com/game/login',
    });
  }

  protected onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.authService.login(this.loginForm.controls.username.value);
    this.router.navigate(['game']);
  }
}
