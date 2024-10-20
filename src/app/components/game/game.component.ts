import { Component, OnInit, viewChild, inject } from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
} from '@angular/cdk/drag-drop';
import { VerbDetails } from '../../model/verb-details';
import { VerbsService } from '../../services/verbs/verbs.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { GameOverDialogComponent } from './game-over-dialog/game-over-dialog.component';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  standalone: true,
  imports: [CdkDropListGroup, CdkDropList, CdkDrag, MatButton],
})
export class GameComponent implements OnInit {
  private readonly submitBtn = viewChild<MatButton>('submitBtn');
  private readonly verbsService = inject(VerbsService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  protected selected: Partial<VerbDetails> = {};
  protected items: string[] = [];
  protected currentIndex = 0;
  protected time = '00:00:00';

  private readonly defaultSelectedItem: Partial<VerbDetails> = {
    base: undefined,
    pastSimple: undefined,
    pastParticiple: undefined,
  };
  private readonly MAX_NUMBER = 50;

  private verbDetails?: VerbDetails;
  private verbs: VerbDetails[] = [];
  private timeValue = 0;
  private interval: number;

  get keys(): (keyof VerbDetails)[] {
    return Object.keys(this.defaultSelectedItem) as (keyof VerbDetails)[];
  }

  get isSelected(): boolean {
    return Object.values(this.selected).some(Boolean);
  }

  constructor() {
    this.interval = this.startTimer();
  }

  ngOnInit(): void {
    this.prepareVerbsForGame();
  }

  protected drop(event: CdkDragDrop<string[]>, key: keyof VerbDetails): void {
    this.selected[key] = this.items[event.item.data.index];
    delete this.items[event.item.data.index];

    setTimeout(() => {
      this.submitBtn()?.focus();
    });
  }

  protected onCheck(): void {
    if (!this.verbDetails) {
      return;
    }

    const isCorrect = Object.keys(this.verbDetails).every(
      (key) =>
        this.verbDetails &&
        this.selected[key as keyof VerbDetails] ===
          this.verbDetails[key as keyof VerbDetails],
    );

    if (isCorrect) {
      this.currentIndex += 1;
    }

    const isCompleted = this.currentIndex === this.MAX_NUMBER;

    if (isCorrect && !isCompleted) {
      this.showSnack();
      this.initValues();
    } else {
      clearInterval(this.interval);
      this.dialog.open(GameOverDialogComponent, {
        data: {
          score: this.currentIndex,
          time: this.time,
          isCompleted,
        },
      });
    }
  }

  protected enterPredicate = (drag: CdkDrag, drop: CdkDropList): boolean => {
    return !this.selected?.[drop.id as keyof VerbDetails];
  };

  private initValues(): void {
    this.selected = { ...this.defaultSelectedItem };
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
    this.verbsService.getVerbsForGame().subscribe((verbs) => {
      this.verbs = verbs;
      this.initValues();
    });
  }

  private showSnack(): void {
    const message = this.shuffleArray([
      'Correct!',
      "You're right!",
      'Awesome!',
      'Good job!',
    ])[0];
    this.snackBar.open(message, '', {
      verticalPosition: 'top',
      panelClass: 'success',
      duration: 3000,
    });
  }

  private startTimer(): number {
    const format = (value: number): string => {
      const hours = Math.floor(value / 3600);
      const minutes = Math.floor((value - hours * 3600) / 60);
      const seconds = value - hours * 3600 - minutes * 60;
      return `${hours > 9 ? hours : '0' + hours}:${minutes > 9 ? minutes : '0' + minutes}:${seconds > 9 ? seconds : '0' + seconds}`;
    };

    return setInterval(() => {
      this.timeValue++;
      this.time = format(this.timeValue);
    }, 1000);
  }
}
