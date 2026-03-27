import {
  Component,
  OnDestroy,
  OnInit,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
} from '@angular/cdk/drag-drop';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { VerbDetails } from '../../model/verb-details';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { GameOverDialogComponent } from './game-over-dialog/game-over-dialog.component';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { HowToPlayComponent } from './how-to-play/how-to-play.component';
import { Store } from '@ngrx/store';
import {
  endGame,
  incrementScore,
  startGame,
  updateTime,
} from 'src/app/store/game/game.actions';
import { loadGameVerbs } from 'src/app/store/verbs/verbs.actions';
import {
  selectGameScore,
  selectGameTime,
} from 'src/app/store/game/game.selectors';
import { selectGameVerbs } from 'src/app/store/verbs/verbs.selectors';
import { take } from 'rxjs/operators';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  imports: [
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    MatButton,
    MatIcon,
    TranslatePipe,
  ],
})
export class GameComponent implements OnInit, OnDestroy {
  private readonly submitBtn = viewChild<MatButton>('submitBtn');
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  private readonly liveAnnouncer = inject(LiveAnnouncer);
  private readonly store = inject(Store);
  private readonly translate = inject(TranslateService);

  protected selected: Partial<VerbDetails> = {};
  protected items: string[] = [];
  protected currentIndex = 0;
  protected time = '00:00:00';
  protected isGameOver = false;

  /** CSS-only score bump when the player answers correctly. */
  protected readonly scoreBump = signal(false);

  readonly score$ = this.store.select(selectGameScore);
  readonly time$ = this.store.select(selectGameTime);

  private readonly defaultSelectedItem: Partial<VerbDetails> = {
    base: undefined,
    pastSimple: undefined,
    pastParticiple: undefined,
  };
  private readonly MAX_NUMBER = 50;

  private verbDetails?: VerbDetails;
  private verbs: VerbDetails[] = [];
  private timeValue = 0;
  private interval!: ReturnType<typeof setInterval>;

  get keys(): (keyof VerbDetails)[] {
    return Object.keys(this.defaultSelectedItem).filter(
      (key: string) => key !== 'id',
    ) as (keyof VerbDetails)[];
  }

  get isSelected(): boolean {
    return Object.values(this.selected).some(Boolean);
  }

  constructor() {
    this.interval = this.startTimer();
  }

  ngOnInit(): void {
    this.store.dispatch(startGame());
    this.store.dispatch(loadGameVerbs());
    this.prepareVerbsForGame();
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  protected onSelectedItemCloseClick(key: keyof VerbDetails): void {
    if (this.selected[key]) {
      const index = this.items.findIndex((val) => !val);
      this.items[index] = this.selected[key] as string;
      delete this.selected[key];
    }
  }

  protected onItemClick(index: number): void {
    const key = this.keys.find(
      (key: keyof VerbDetails) => this.selected[key] === undefined,
    );
    this.selected[key!] = this.items[index];
    delete this.items[index];

    setTimeout(() => {
      this.submitBtn()?.focus();
    });
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

    const isCorrect = Object.keys(this.verbDetails)
      .filter((key: string) => key !== 'id')
      .every(
        (key) =>
          this.verbDetails &&
          this.selected[key as keyof VerbDetails] ===
            this.verbDetails[key as keyof VerbDetails],
      );

    if (isCorrect) {
      this.currentIndex += 1;
      this.store.dispatch(incrementScore());
      this.scoreBump.set(true);
      setTimeout(() => this.scoreBump.set(false), 500);
    }

    const isCompleted = this.currentIndex === this.MAX_NUMBER;

    if (isCorrect && !isCompleted) {
      this.liveAnnouncer.announce(
        this.translate.instant('GAME.ANNOUNCE_CORRECT', {
          score: this.currentIndex,
          max: this.MAX_NUMBER,
        }),
        'polite',
      );
      this.showSnack();
      this.initValues();
    } else {
      this.isGameOver = true;
      clearInterval(this.interval);

      this.store.dispatch(endGame({ time: this.time, isCompleted }));

      const announcement = isCompleted
        ? this.translate.instant('GAME.ANNOUNCE_WIN', {
            max: this.MAX_NUMBER,
            time: this.time,
          })
        : this.translate.instant('GAME.ANNOUNCE_LOSE', {
            score: this.currentIndex,
            max: this.MAX_NUMBER,
            time: this.time,
          });
      this.liveAnnouncer.announce(announcement, 'assertive');

      this.store.select(selectGameScore).pipe(take(1)).subscribe((score) => {
        this.dialog.open(GameOverDialogComponent, {
          data: {
            score,
            time: this.time,
            isCompleted,
          },
          ariaLabel: isCompleted
            ? this.translate.instant('GAME.DIALOG_WIN_ARIA')
            : this.translate.instant('GAME.DIALOG_LOSE_ARIA'),
          ariaDescribedBy: 'game-over-content',
        });
      });
    }
  }

  protected enterPredicate = (drag: CdkDrag, drop: CdkDropList): boolean => {
    return !this.selected?.[drop.id as keyof VerbDetails];
  };

  protected onHowToPlayClick(): void {
    this.dialog.open(HowToPlayComponent, {
      ariaLabel: this.translate.instant('GAME.HOW_TO_DIALOG_ARIA'),
    });
  }

  protected removeFromSlotAria(
    key: keyof VerbDetails,
    word: string,
  ): string {
    return this.translate.instant('GAME.REMOVE_FROM_SLOT', {
      word,
      slot: this.slotNounLabel(key),
    });
  }

  protected zonePlaceholderKey(key: keyof VerbDetails): string {
    const map: Record<string, string> = {
      base: 'GAME.ZONE_BASE',
      pastSimple: 'GAME.ZONE_PAST',
      pastParticiple: 'GAME.ZONE_PART',
    };
    return map[key as string] ?? String(key);
  }

  protected getDropZoneLabel(key: keyof VerbDetails): string {
    const labels: Record<string, string> = {
      base: this.translate.instant('GAME.DROP_BASE'),
      pastSimple: this.translate.instant('GAME.DROP_PAST'),
      pastParticiple: this.translate.instant('GAME.DROP_PART'),
    };
    const selected = this.selected[key];
    const zone = labels[key as string] ?? String(key);
    return selected
      ? this.translate.instant('GAME.DROP_ZONE_STATE', {
          zone,
          value: selected,
        })
      : this.translate.instant('GAME.DROP_EMPTY', { zone });
  }

  private slotNounLabel(key: keyof VerbDetails): string {
    const map: Record<string, string> = {
      base: 'GAME.SLOT_BASE',
      pastSimple: 'GAME.SLOT_PAST',
      pastParticiple: 'GAME.SLOT_PART',
    };
    const id = map[key as string];
    return id ? this.translate.instant(id) : String(key);
  }

  private initValues(): void {
    this.selected = { ...this.defaultSelectedItem };
    this.verbDetails = this.verbs[this.currentIndex];
    this.items = this.shuffleArray(
      Object.entries(this.verbDetails)
        .filter(([key]: [string, string]) => key !== 'id')
        .map(([, val]: [string, string]) => val),
    );
  }

  private shuffleArray(array: string[]): string[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  private prepareVerbsForGame(): void {
    this.store.select(selectGameVerbs).pipe(take(1)).subscribe((cachedVerbs) => {
      if (cachedVerbs.length > 0) {
        this.verbs = cachedVerbs;
        this.initValues();
      }
    });

    // Also subscribe to updates from the effect loading game verbs
    this.store.select(selectGameVerbs).subscribe((verbs) => {
      if (verbs.length > 0 && this.verbs.length === 0) {
        this.verbs = verbs;
        this.initValues();
      }
    });
  }

  private showSnack(): void {
    const message = this.shuffleArray([
      this.translate.instant('GAME.SNACK_CORRECT'),
      this.translate.instant('GAME.SNACK_RIGHT'),
      this.translate.instant('GAME.SNACK_AWESOME'),
      this.translate.instant('GAME.SNACK_GOOD_JOB'),
    ])[0];
    this.snackBar.open(message, '', {
      verticalPosition: 'top',
      panelClass: 'success',
      duration: 3000,
    });
  }

  private startTimer(): ReturnType<typeof setInterval> {
    const format = (value: number): string => {
      const hours = Math.floor(value / 3600);
      const minutes = Math.floor((value - hours * 3600) / 60);
      const seconds = value - hours * 3600 - minutes * 60;
      return `${hours > 9 ? hours : '0' + hours}:${minutes > 9 ? minutes : '0' + minutes}:${seconds > 9 ? seconds : '0' + seconds}`;
    };

    return setInterval(() => {
      this.timeValue++;
      this.time = format(this.timeValue);
      this.store.dispatch(updateTime({ time: this.time }));
    }, 1000);
  }
}
