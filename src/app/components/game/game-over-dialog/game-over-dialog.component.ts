import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VerbDetails } from '../../../model/verb-details';

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
})
export class GameOverDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}
