import { BreakpointObserver } from '@angular/cdk/layout';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { VerbDetails } from 'src/app/model/verb-details';
import { PromptService } from 'src/app/services/prompt/prompt.service';
import { loadVerbs } from 'src/app/store/verbs/verbs.actions';
import {
  selectAllVerbs,
  selectVerbsError,
  selectVerbsLoading,
} from 'src/app/store/verbs/verbs.selectors';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-verbs',
  imports: [
    AsyncPipe,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    TranslatePipe,
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

  readonly verbs$ = this.store.select(selectAllVerbs);
  readonly loading$ = this.store.select(selectVerbsLoading);
  readonly error$ = this.store.select(selectVerbsError);

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

  ngOnInit(): void {
    this.store.dispatch(loadVerbs());
  }

  toggleExpanded(element: VerbDetails): void {
    this.expandedElement.update((current) =>
      current === element ? null : element,
    );
  }
}
