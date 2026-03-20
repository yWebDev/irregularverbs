import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideMockStore } from '@ngrx/store/testing';
import { VerbsComponent } from './verbs.component';
import { axe, toHaveNoViolations } from 'jasmine-axe';
import { of } from 'rxjs';
import { VerbsService } from '../../services/verbs/verbs.service';

describe('VerbsComponent Accessibility', () => {
  let fixture: ComponentFixture<VerbsComponent>;

  beforeEach(async () => {
    jasmine.addMatchers(toHaveNoViolations);

    const verbsServiceSpy = jasmine.createSpyObj('VerbsService', ['getAllVerbs']);
    verbsServiceSpy.getAllVerbs.and.returnValue(
      of([
        { id: '1', base: 'be', pastSimple: 'was', pastParticiple: 'been' },
        { id: '2', base: 'go', pastSimple: 'went', pastParticiple: 'gone' },
        { id: '3', base: 'do', pastSimple: 'did', pastParticiple: 'done' },
      ]),
    );

    await TestBed.configureTestingModule({
      imports: [VerbsComponent],
      providers: [
        provideHttpClient(),
        provideAnimations(),
        provideMockStore(),
        { provide: VerbsService, useValue: verbsServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VerbsComponent);
    fixture.detectChanges();
  });

  it('should have no accessibility violations', async () => {
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });

  it('should have table with aria-label', () => {
    const table = fixture.nativeElement.querySelector('table');
    expect(table.getAttribute('aria-label')).toContain('irregular verbs');
  });

  it('should have expand buttons with aria-expanded', () => {
    const expandButtons = fixture.nativeElement.querySelectorAll(
      '[mat-icon-button]',
    );
    expandButtons.forEach((button: HTMLElement) => {
      expect(button.hasAttribute('aria-expanded')).toBe(true);
      expect(button.hasAttribute('aria-controls')).toBe(true);
      expect(button.getAttribute('aria-label')).toContain('examples');
    });
  });

  it('should have aria-live region for examples', () => {
    const expandButton = fixture.nativeElement.querySelector('[mat-icon-button]');
    expandButton.click();
    fixture.detectChanges();

    const liveRegion = fixture.nativeElement.querySelector('[aria-live="polite"]');
    expect(liveRegion).toBeTruthy();
  });

  it('should update aria-expanded when row is expanded', () => {
    const expandButton = fixture.nativeElement.querySelector('[mat-icon-button]');
    expect(expandButton.getAttribute('aria-expanded')).toBe('false');

    expandButton.click();
    fixture.detectChanges();

    expect(expandButton.getAttribute('aria-expanded')).toBe('true');
  });

  it('should have proper aria-controls linking to detail row', () => {
    const expandButton = fixture.nativeElement.querySelector('[mat-icon-button]');
    const ariaControls = expandButton.getAttribute('aria-controls');
    expect(ariaControls).toBeTruthy();

    expandButton.click();
    fixture.detectChanges();

    const detailElement = fixture.nativeElement.querySelector(`#${ariaControls}`);
    expect(detailElement).toBeTruthy();
  });
});
