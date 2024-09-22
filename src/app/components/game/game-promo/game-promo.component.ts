import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-game-promo',
  templateUrl: './game-promo.component.html',
  styleUrls: ['./game-promo.component.scss'],
})
export class GamePromoComponent {
  name: string | null;

  constructor(private authService: AuthService) {
    this.name = this.authService.username;
  }
}
