import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { AsyncPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { of } from 'rxjs';
import { VerbDetails } from 'src/app/model/verb-details';
import { MetaService } from 'src/app/services/meta/meta.service';
import { PromptService } from 'src/app/services/prompt/prompt.service';
import { VerbsService } from 'src/app/services/verbs/verbs.service';

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
export class VerbsComponent {
  private readonly metaService = inject(MetaService).updateMeta(
    'Complete List of Irregular Verbs',
    'Explore a comprehensive table of irregular verbs to enhance your English skills!',
  );
  private readonly promptService = inject(PromptService);

  $verbs = inject(VerbsService).getAllVerbs();

  expandedElement = signal<VerbDetails | null>(null);
  formsExamplesResource$ = rxResource({
    request: () => this.expandedElement(),
    loader: ({ request }) =>
      request ? this.promptService.getVerbFormsExamples(request) : of(null),
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
}
