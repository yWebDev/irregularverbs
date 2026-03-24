import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GameOverDialogComponent } from './game-over-dialog.component';
import { axe, toHaveNoViolations } from 'jasmine-axe';
import { testingTranslateProviders } from '../../../testing/testing-translate.providers';

describe('GameOverDialogComponent Accessibility', () => {
  let fixture: ComponentFixture<GameOverDialogComponent>;

  const mockDialogData = {
    score: 45,
    time: '02:30:15',
    isCompleted: true,
  };

  beforeEach(async () => {
    jasmine.addMatchers(toHaveNoViolations);

    await TestBed.configureTestingModule({
      imports: [GameOverDialogComponent],
      providers: [
        ...testingTranslateProviders,
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GameOverDialogComponent);
    fixture.detectChanges();
  });

  it('should have no accessibility violations', async () => {
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });

  it('should have dialog title with proper id', () => {
    const title = fixture.nativeElement.querySelector('#game-over-title');
    expect(title).toBeTruthy();
    expect(title.textContent).toContain('Congratulations!');
  });

  it('should have dialog content with aria-describedby', () => {
    const content = fixture.nativeElement.querySelector('#game-over-content');
    expect(content).toBeTruthy();
    expect(content.getAttribute('aria-describedby')).toBe('game-over-title');
  });

  it('should have close button with accessible name', () => {
    const closeButton = fixture.nativeElement.querySelector(
      'mat-dialog-actions button',
    );
    expect(closeButton).toBeTruthy();
    const aria = closeButton?.getAttribute('aria-label');
    const label = aria ?? closeButton?.textContent ?? '';
    expect(label).toContain('Close');
  });

  it('should display score and time with semantic markup', () => {
    const content = fixture.nativeElement.querySelector('#game-over-content');
    expect(content.textContent).toContain('45');
    expect(content.textContent).toContain('02:30:15');
  });

  it('should show correct title for incomplete game', async () => {
    const incompleteData = { ...mockDialogData, isCompleted: false };
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [GameOverDialogComponent],
      providers: [
        ...testingTranslateProviders,
        { provide: MAT_DIALOG_DATA, useValue: incompleteData },
      ],
    }).compileComponents();

    const newFixture = TestBed.createComponent(GameOverDialogComponent);
    newFixture.detectChanges();

    const title = newFixture.nativeElement.querySelector('#game-over-title');
    expect(title.textContent).toContain('Game Over');
  });
});
