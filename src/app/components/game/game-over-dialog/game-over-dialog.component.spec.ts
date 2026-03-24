import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { GameOverDialogComponent } from './game-over-dialog.component';
import { testingTranslateProviders } from '../../../testing/testing-translate.providers';

describe('GameOverDialogComponent', () => {
  let component: GameOverDialogComponent;
  let fixture: ComponentFixture<GameOverDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameOverDialogComponent],
      providers: [
        ...testingTranslateProviders,
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            score: 0,
            time: 0,
            correctVerb: { base: 'test', past: 'tested', participle: 'tested' },
            selected: { base: 'test', past: 'tested', participle: 'tested' },
            isCompleted: false,
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameOverDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
