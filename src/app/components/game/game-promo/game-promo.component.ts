import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { HowToPlayComponent } from '../how-to-play/how-to-play.component';
import { MetaService } from 'src/app/services/meta/meta.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-game-promo',
  templateUrl: './game-promo.component.html',
  styleUrls: ['./game-promo.component.scss'],
  imports: [MatButton, RouterLink, TranslatePipe],
})
export class GamePromoComponent {
  private readonly authService = inject(AuthService);
  private readonly dialog = inject(MatDialog);
  private readonly metaService = inject(MetaService);
  private readonly translate = inject(TranslateService);

  constructor() {
    this.metaService.updateMeta({
      title: 'Start Learning Through Play',
      description: 'Boost your knowledge with a fun and interactive game!',
      keywords: 'irregular verbs game, English learning game, ESL game, verb practice',
      url: 'https://irregverbs-1381.uc.r.appspot.com/game'
    });
  }

  protected name: string | null = this.authService.username;

  protected onHowToPlayClick(): void {
    this.dialog.open(HowToPlayComponent, {
      ariaLabel: this.translate.instant('GAME.HOW_TO_DIALOG_ARIA'),
    });
  }
}
