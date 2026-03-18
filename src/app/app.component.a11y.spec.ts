import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { axe, toHaveNoViolations } from 'jasmine-axe';

describe('AppComponent Accessibility', () => {
  beforeEach(async () => {
    jasmine.addMatchers(toHaveNoViolations);
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should have no accessibility violations', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });

  it('should have skip link that is keyboard accessible', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const skipLink = fixture.nativeElement.querySelector('.skip-link');
    expect(skipLink).toBeTruthy();
    expect(skipLink.getAttribute('href')).toBe('#main-content');
  });

  it('should have proper navigation landmarks', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const nav = fixture.nativeElement.querySelector('nav');
    expect(nav.getAttribute('aria-label')).toBe('Main navigation');
  });

  it('should have main content with tabindex for focus management', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const mainContent = fixture.nativeElement.querySelector('#main-content');
    expect(mainContent).toBeTruthy();
    expect(mainContent.getAttribute('tabindex')).toBe('-1');
  });
});
