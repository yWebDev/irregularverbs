import { BreakpointObserver } from '@angular/cdk/layout';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { NgTemplateOutlet } from '@angular/common';
import { Component, OnInit, effect, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { VerbDetails } from 'src/app/model/verb-details';
import { PromptService } from 'src/app/services/prompt/prompt.service';
import { VerbsTableWorkerService } from 'src/app/services/verbs-table-worker/verbs-table-worker.service';
import { loadVerbs } from 'src/app/store/verbs/verbs.actions';
import {
  selectAllVerbs,
  selectVerbsError,
  selectVerbsLoading,
} from 'src/app/store/verbs/verbs.selectors';
import { TranslatePipe } from '@ngx-translate/core';
import { ScrollRevealDirective } from 'src/app/directives/scroll-reveal.directive';
import { filterAndSortVerbs, VerbSortKey } from 'src/app/utils/functional';

@Component({
  selector: 'app-verbs',
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    TranslatePipe,
    NgTemplateOutlet,
    ScrollRevealDirective,
  ],
  templateUrl: './verbs.component.html',
  styleUrl: './verbs.component.scss',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'),
      ),
    ]),
  ],
})
export class VerbsComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly promptService = inject(PromptService);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly verbsTableWorker = inject(VerbsTableWorkerService);

  readonly verbs = toSignal(this.store.select(selectAllVerbs), { initialValue: [] as VerbDetails[] });
  readonly loading = toSignal(this.store.select(selectVerbsLoading), { initialValue: false });
  readonly error = toSignal(this.store.select(selectVerbsError), { initialValue: null });

  /** Table filter / sort (heavy work: Web Worker + WASM Levenshtein ranking in the worker service). */
  readonly tableFilter = signal('');
  readonly sortKey = signal<VerbSortKey>('base');
  readonly displayedVerbs = signal<VerbDetails[]>([]);

  /** Card layout below md breakpoint (mobile-first). */
  readonly isNarrowLayout = toSignal(
    this.breakpointObserver
      .observe('(max-width: 767.98px)')
      .pipe(map((state) => state.matches)),
    { initialValue: false },
  );

  readonly skeletonRows: readonly number[] = [1, 2, 3, 4, 5];

  expandedElement = signal<VerbDetails | null>(null);
  formsExamplesResource$ = rxResource<string | null, VerbDetails | null>({
    params: () => this.expandedElement(),
    stream: ({ params }: { params: VerbDetails | null }) =>
      params ? this.promptService.getVerbFormsExamples(params) : of(null),
  });

  protected readonly displayedColumns: string[] = [
    'base',
    'pastSimple',
    'pastParticiple',
  ];
  protected readonly displayedColumnsWithExpand: string[] = [
    ...this.displayedColumns,
    'expand',
  ];

  constructor() {
    effect((onCleanup) => {
      const verbs = this.verbs();
      const filter = this.tableFilter();
      const sortKey = this.sortKey();
      this.displayedVerbs.set(filterAndSortVerbs(verbs, filter, sortKey));
      let cancelled = false;
      onCleanup(() => {
        cancelled = true;
      });
      void this.verbsTableWorker
        .processVerbs({ verbs, filter, sortKey })
        .then((list) => {
          if (!cancelled) this.displayedVerbs.set(list);
        });
    });
  }

  ngOnInit(): void {
    this.store.dispatch(loadVerbs());
  }

  toggleExpanded(element: VerbDetails): void {
    this.expandedElement.update((current) =>
      current === element ? null : element,
    );
  }

  protected setSortKey(value: string): void {
    if (value === 'base' || value === 'pastSimple' || value === 'pastParticiple') {
      this.sortKey.set(value);
    }
  }
}
