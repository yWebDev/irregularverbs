import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { HowToPlayComponent } from '../how-to-play/how-to-play.component';

@Component({
  selector: 'app-game-promo',
  templateUrl: './game-promo.component.html',
  styleUrls: ['./game-promo.component.scss'],
  standalone: true,
  imports: [MatButton, RouterLink],
})
export class GamePromoComponent {
  private readonly authService = inject(AuthService);
  private readonly dialog = inject(MatDialog);

  protected name: string | null = this.authService.username;

  protected onHowToPlayClick(): void {
    this.dialog.open(HowToPlayComponent);
  }
}
