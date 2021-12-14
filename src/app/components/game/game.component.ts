import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { VerbDetails } from '../../model/verb-details';
import { VerbsService } from '../../services/verbs/verbs.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { GameOverDialogComponent } from './game-over-dialog/game-over-dialog.component';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  @ViewChild('submitBtn') submitBtn?: MatButton;

  readonly defaultSelectedItem: Partial<VerbDetails> = {
    base: undefined,
    pastSimple: undefined,
    pastParticiple: undefined,
  };
  selected: Partial<VerbDetails> = {};
  items: string[] = [];
  verbDetails?: VerbDetails;
  currentIndex = 0;
  verbs: VerbDetails[] = [];
  startTime = 0;

  get keys(): (keyof VerbDetails)[] {
    return Object.keys(this.defaultSelectedItem) as (keyof VerbDetails)[];
  }

  get isSelected(): boolean {
    return Object.values(this.selected).some(Boolean);
  }

  constructor(
    private verbsService: VerbsService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.prepareVerbsForGame();
    this.startTime = performance.now();
  }

  drop(event: CdkDragDrop<string[]>, key: keyof VerbDetails): void {
    this.selected[key] = this.items[event.item.data.index];
    delete this.items[event.item.data.index];

    setTimeout(() => {
      this.submitBtn?.focus();
    });
  }

  onCheck(): void {
    if (!this.verbDetails) {
      return;
    }

    const isCorrect = Object.keys(this.verbDetails)
      .every((key => this.verbDetails && this.selected[key as keyof VerbDetails] === this.verbDetails[key as keyof VerbDetails]));

    if (isCorrect) {
      this.showSnack();
      this.currentIndex += 1;
      this.initValues();
    } else {
      const time = ((performance.now() - this.startTime) / 1000).toFixed(1);
      this.dialog.open(GameOverDialogComponent, {
        data: {
          score: this.currentIndex,
          time
        }
      });
    }
  }

  enterPredicate = (drag: CdkDrag, drop: CdkDropList): boolean => {
    return !this.selected?.[drop.id as keyof VerbDetails];
  }

  private initValues(): void {
    this.selected = {...this.defaultSelectedItem};
    this.verbDetails = this.verbs[this.currentIndex];
    this.items = this.shuffleArray(Object.values(this.verbDetails));
  }

  private shuffleArray(array: string[]): string[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  private prepareVerbsForGame(): void {
    this.verbsService.getVerbsForGame().subscribe(verbs => {
      this.verbs = verbs;
      this.initValues();
    });
  }

  private showSnack(): void {
    const message = this.shuffleArray(['Correct!', 'You\'re right!', 'Awesome!', 'Good job!'])[0];
    this.snackBar.open(message, '', {
      verticalPosition: 'top',
      panelClass: 'success',
      duration: 3000
    });
  }
}
