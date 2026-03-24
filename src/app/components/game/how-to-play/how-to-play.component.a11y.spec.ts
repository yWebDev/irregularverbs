import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HowToPlayComponent } from './how-to-play.component';
import { axe, toHaveNoViolations } from 'jasmine-axe';
import { testingTranslateProviders } from '../../../testing/testing-translate.providers';

describe('HowToPlayComponent Accessibility', () => {
  let fixture: ComponentFixture<HowToPlayComponent>;

  beforeEach(async () => {
    jasmine.addMatchers(toHaveNoViolations);

    await TestBed.configureTestingModule({
      imports: [HowToPlayComponent],
      providers: [...testingTranslateProviders],
    }).compileComponents();

    fixture = TestBed.createComponent(HowToPlayComponent);
    fixture.detectChanges();
  });

  it('should have no accessibility violations', async () => {
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });

  it('should have dialog title with proper id', () => {
    const title = fixture.nativeElement.querySelector('#how-to-play-title');
    expect(title).toBeTruthy();
    expect(title.textContent).toContain('How to play?');
  });

  it('should have dialog content with aria-describedby', () => {
    const content = fixture.nativeElement.querySelector('#how-to-play-content');
    expect(content).toBeTruthy();
    expect(content.getAttribute('aria-describedby')).toBe('how-to-play-title');
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

  it('should have proper heading hierarchy', () => {
    const h2 = fixture.nativeElement.querySelector('h2');
    const h3s = fixture.nativeElement.querySelectorAll('h3');
    expect(h2).toBeTruthy();
    expect(h3s.length).toBeGreaterThan(0);
  });
});
