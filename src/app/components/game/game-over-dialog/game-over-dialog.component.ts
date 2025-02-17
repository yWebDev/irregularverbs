import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { VerbDetails } from '../../../model/verb-details';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatButton } from '@angular/material/button';

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
        CdkScrollable,
        MatDialogContent,
        MatDialogActions,
        MatButton,
        MatDialogClose,
    ]
})
export class GameOverDialogComponent {
  protected data: DialogData = inject(MAT_DIALOG_DATA);
}
