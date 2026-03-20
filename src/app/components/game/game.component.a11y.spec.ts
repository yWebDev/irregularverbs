import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideMockStore } from '@ngrx/store/testing';
import { GameComponent } from './game.component';
import { axe, toHaveNoViolations } from 'jasmine-axe';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { of } from 'rxjs';
import { VerbsService } from '../../services/verbs/verbs.service';

describe('GameComponent Accessibility', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;
  let liveAnnouncer: jasmine.SpyObj<LiveAnnouncer>;

  beforeEach(async () => {
    jasmine.addMatchers(toHaveNoViolations);

    const liveAnnouncerSpy = jasmine.createSpyObj('LiveAnnouncer', ['announce']);
    const verbsServiceSpy = jasmine.createSpyObj('VerbsService', [
      'getVerbsForGame',
    ]);
    verbsServiceSpy.getVerbsForGame.and.returnValue(
      of([
        { id: '1', base: 'be', pastSimple: 'was', pastParticiple: 'been' },
        { id: '2', base: 'go', pastSimple: 'went', pastParticiple: 'gone' },
      ]),
    );

    await TestBed.configureTestingModule({
      imports: [GameComponent],
      providers: [
        provideHttpClient(),
        provideAnimations(),
        provideMockStore(),
        { provide: LiveAnnouncer, useValue: liveAnnouncerSpy },
        { provide: VerbsService, useValue: verbsServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    liveAnnouncer = TestBed.inject(LiveAnnouncer) as jasmine.SpyObj<LiveAnnouncer>;
    fixture.detectChanges();
  });

  it('should have no accessibility violations', async () => {
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });

  it('should have aria-live region for score updates', () => {
    const scoreElement = fixture.nativeElement.querySelector('.game-score');
    expect(scoreElement.getAttribute('aria-live')).toBe('polite');
    expect(scoreElement.getAttribute('aria-atomic')).toBe('true');
  });

  it('should have labeled drop zones', () => {
    const dropZones: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('[cdkDropList]');
    const targetZones = Array.from(dropZones).filter((el: HTMLElement) =>
      ['base', 'pastSimple', 'pastParticiple'].includes(el.id),
    );
    targetZones.forEach((zone: HTMLElement) => {
      expect(zone.getAttribute('aria-label')).toBeTruthy();
    });
  });

  it('should have keyboard-accessible drag items', () => {
    const dragItems = fixture.nativeElement.querySelectorAll('.drag-item');
    dragItems.forEach((item: HTMLElement) => {
      expect(item.getAttribute('role')).toBe('button');
      expect(item.getAttribute('tabindex')).toBe('0');
      expect(item.getAttribute('aria-label')).toContain('Verb form:');
    });
  });

  it('should announce score updates via LiveAnnouncer', () => {
    component['verbDetails'] = {
      id: '1',
      base: 'be',
      pastSimple: 'was',
      pastParticiple: 'been',
    };
    component['selected'] = {
      base: 'be',
      pastSimple: 'was',
      pastParticiple: 'been',
    };

    component['onCheck']();

    expect(liveAnnouncer.announce).toHaveBeenCalled();
    const callArgs = liveAnnouncer.announce.calls.mostRecent().args;
    expect(callArgs[0]).toContain('Correct!');
    expect(callArgs[1]).toBe('polite');
  });

  it('should have proper dialog aria attributes', () => {
    const howToPlayLink = fixture.nativeElement.querySelector('.how-to-play a');
    expect(howToPlayLink.getAttribute('aria-haspopup')).toBe('dialog');
  });
});
