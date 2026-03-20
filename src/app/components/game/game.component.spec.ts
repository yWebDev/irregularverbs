import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';

import { GameComponent } from './game.component';
import { VerbsService } from '../../services/verbs/verbs.service';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;

  beforeEach(async () => {
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
        provideAnimations(),
        provideMockStore(),
        { provide: VerbsService, useValue: verbsServiceSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
