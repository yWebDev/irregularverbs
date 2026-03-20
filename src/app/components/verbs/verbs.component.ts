import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { VerbDetails } from 'src/app/model/verb-details';
import { MetaService } from 'src/app/services/meta/meta.service';
import { PromptService } from 'src/app/services/prompt/prompt.service';
import { loadVerbs } from 'src/app/store/verbs/verbs.actions';
import {
  selectAllVerbs,
  selectVerbsError,
  selectVerbsLoading,
} from 'src/app/store/verbs/verbs.selectors';

@Component({
  selector: 'app-verbs',
  imports: [AsyncPipe, MatTableModule, MatIconModule, MatButtonModule],
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
  private readonly metaService = inject(MetaService);
  private readonly promptService = inject(PromptService);

  readonly verbs$ = this.store.select(selectAllVerbs);
  readonly loading$ = this.store.select(selectVerbsLoading);
  readonly error$ = this.store.select(selectVerbsError);

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
    this.metaService.updateMeta({
      title: 'Complete List of Irregular Verbs',
      description:
        'Explore a comprehensive table of irregular verbs to enhance your English skills!',
      keywords:
        'irregular verbs list, English verb forms, verb conjugation, ESL resources',
      url: 'https://irregverbs-1381.uc.r.appspot.com/verbs',
    });
  }

  ngOnInit(): void {
    this.store.dispatch(loadVerbs());
  }
}
