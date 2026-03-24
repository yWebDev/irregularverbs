import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { VerbDetails } from '../../../model/verb-details';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

export interface DialogData {
  score: number;
  time: number;
  correctVerb: VerbDetails;
  selected: VerbDetails;
  isCompleted: boolean;
}

@Component({
    selector: 'app-game-over-dialog',
    templateUrl: './game-over-dialog.component.html',
    styleUrls: ['./game-over-dialog.component.scss'],
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatButton,
        MatDialogClose,
        TranslatePipe,
    ]
})
export class GameOverDialogComponent {
  protected data: DialogData = inject(MAT_DIALOG_DATA);
}
