import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { SearchComponent } from './search.component';
import { axe, toHaveNoViolations } from 'jasmine-axe';
import { testingTranslateProviders } from '../../testing/testing-translate.providers';

describe('SearchComponent Accessibility', () => {
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async () => {
    jasmine.addMatchers(toHaveNoViolations);

    await TestBed.configureTestingModule({
      imports: [SearchComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        ...testingTranslateProviders,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    fixture.detectChanges();
  });

  it('should have no accessibility violations', async () => {
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });

  it('should have proper heading hierarchy', () => {
    const h2 = fixture.nativeElement.querySelector('h2');
    expect(h2).toBeTruthy();
    expect(h2.textContent).toContain('Learn Irregular Verb Forms');
  });

  it('should have semantic section elements', () => {
    const sections = fixture.nativeElement.querySelectorAll('section');
    expect(sections.length).toBeGreaterThan(0);
  });

  it('should have accessible links with proper text', () => {
    const links = fixture.nativeElement.querySelectorAll('a[routerLink]');
    links.forEach((link: HTMLElement) => {
      expect(link.textContent?.trim().length).toBeGreaterThan(0);
    });
  });
});
