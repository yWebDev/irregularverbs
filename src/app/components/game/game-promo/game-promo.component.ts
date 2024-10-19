import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-game-promo',
  templateUrl: './game-promo.component.html',
  styleUrls: ['./game-promo.component.scss'],
  standalone: true,
  imports: [MatButton, RouterLink],
})
export class GamePromoComponent {
  name: string | null;

  private readonly authService = inject(AuthService);

  constructor() {
    this.name = this.authService.username;
  }
}
