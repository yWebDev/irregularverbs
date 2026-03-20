import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';

import { GameComponent } from './game.component';
import { VerbsService } from '../../services/verbs/verbs.service';

const mockInitialState = {
  auth: { username: null, isAuthorized: false },
  game: { score: 0, maxRounds: 50, isGameOver: false, isCompleted: false, isActive: false, time: '00:00:00', history: [] },
  verbs: { verbs: [], gameVerbs: [], loading: false, gameVerbsLoading: false, error: null },
};

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
        provideMockStore({ initialState: mockInitialState }),
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
