import { BreakpointObserver } from '@angular/cdk/layout';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';

import { VerbsComponent } from './verbs.component';
import { LevenshteinWasmService } from '../../services/levenshtein-wasm/levenshtein-wasm.service';
import { VerbsService } from '../../services/verbs/verbs.service';
import { VerbsTableWorkerService } from '../../services/verbs-table-worker/verbs-table-worker.service';
import { testingTranslateProviders } from '../../testing/testing-translate.providers';
import { levenshteinDistance } from '../../utils/functional';

const mockInitialState = {
  auth: { username: null, isAuthorized: false },
  verbs: { verbs: [], gameVerbs: [], loading: false, gameVerbsLoading: false, error: null },
};

describe('VerbsComponent', () => {
  let component: VerbsComponent;
  let fixture: ComponentFixture<VerbsComponent>;

  beforeEach(async () => {
    const verbsServiceSpy = jasmine.createSpyObj('VerbsService', [
      'getAllVerbs',
    ]);
    verbsServiceSpy.getAllVerbs.and.returnValue(
      of([
        { id: '1', base: 'be', pastSimple: 'was', pastParticiple: 'been' },
        { id: '2', base: 'go', pastSimple: 'went', pastParticiple: 'gone' },
      ]),
    );

    await TestBed.configureTestingModule({
      imports: [VerbsComponent],
      providers: [
        provideAnimations(),
        provideMockStore({ initialState: mockInitialState }),
        { provide: VerbsService, useValue: verbsServiceSpy },
        {
          provide: VerbsTableWorkerService,
          useValue: {
            processVerbs: (o: { verbs: unknown[] }) => Promise.resolve(o.verbs),
          },
        },
        {
          provide: LevenshteinWasmService,
          useValue: {
            getDistanceFn: () => Promise.resolve(levenshteinDistance),
          },
        },
        {
          provide: BreakpointObserver,
          useValue: {
            observe: () => of({ matches: false, breakpoints: {} }),
          },
        },
        ...testingTranslateProviders,
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
