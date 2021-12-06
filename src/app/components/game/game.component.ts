import { Component, OnInit } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { VerbDetails } from '../../model/verb-details';
import { VerbsService } from '../../services/verbs/verbs.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  readonly defaultSelectedItem = {
    base: undefined,
    pastSimple: undefined,
    pastParticiple: undefined,
  };
  selected: Partial<VerbDetails> = {};
  items: string[] = [];
  verbDetails?: VerbDetails;
  currentIndex = 0;
  verbs: VerbDetails[] = [];

  get isSelected(): boolean {
    return Object.values(this.selected).some(Boolean);
  }

  constructor(private verbsService: VerbsService) {
  }

  ngOnInit(): void {
    this.prepareVerbsForGame();
  }

  drop(event: CdkDragDrop<string[]>, key: keyof VerbDetails): void {
    this.selected[key] = this.items[event.item.data.index];
    delete this.items[event.item.data.index];
  }

  onCheck(): void {
    if (!this.verbDetails) {
      return;
    }

    const isCorrect = Object.keys(this.verbDetails)
      .every((key => this.verbDetails && this.selected[key as keyof VerbDetails] === this.verbDetails[key as keyof VerbDetails]));
    alert(isCorrect ? 'Correct!' : 'Sorry but no');

    if (isCorrect) {
      this.currentIndex += 1;
      this.initValues();
    }
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
}
