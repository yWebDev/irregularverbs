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
  private readonly authService = inject(AuthService);

  protected name: string | null = this.authService.username;
}
