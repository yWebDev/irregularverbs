import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { VerbInputComponent } from './verb-input.component';
import { axe, toHaveNoViolations } from 'jasmine-axe';

describe('VerbInputComponent Accessibility', () => {
  let component: VerbInputComponent;
  let fixture: ComponentFixture<VerbInputComponent>;

  beforeEach(async () => {
    jasmine.addMatchers(toHaveNoViolations);

    await TestBed.configureTestingModule({
      imports: [VerbInputComponent],
      providers: [provideHttpClient(), provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(VerbInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should have no accessibility violations', async () => {
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });

  it('should have input with aria-label', () => {
    const input = fixture.nativeElement.querySelector('input');
    expect(input.getAttribute('aria-label')).toBe('Verb');
  });

  it('should have clear button with aria-label', () => {
    component['myControl'].setValue('test');
    fixture.detectChanges();

    const clearButton = fixture.nativeElement.querySelector('[aria-label="Clear"]');
    expect(clearButton).toBeTruthy();
  });

  it('should have proper autocomplete accessibility', () => {
    const input = fixture.nativeElement.querySelector('input');
    expect(input.hasAttribute('matInput')).toBe(true);
    expect(input.hasAttribute('aria-label')).toBe(true);
  });

  it('should have form element wrapping the input', () => {
    const form = fixture.nativeElement.querySelector('form');
    expect(form).toBeTruthy();
  });
});
