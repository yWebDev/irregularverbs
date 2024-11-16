import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { VerbDetails } from 'src/app/model/verb-details';
import { PromptService } from 'src/app/services/prompt/prompt.service';

@Component({
  selector: 'app-verb-examples',
  standalone: true,
  imports: [MatExpansionModule, AsyncPipe],
  templateUrl: './verb-examples.component.html',
  styleUrl: './verb-examples.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerbExamplesComponent {
  protected readonly promptService = inject(PromptService);

  details = input.required<VerbDetails>();

  panelOpenState = signal(false);

  baseFormExample$?: Observable<string>;
  pastFormExample$?: Observable<string>;
  participleFormExample$?: Observable<string>;

  getVerbExamples(verb: string, form: string): Observable<string> {
    return this.promptService.getVerbExamples(verb, form).pipe(shareReplay(1));
  }

  getBaseVerbExamples(verb: string, form: string): Observable<string> {
    if (!this.baseFormExample$) {
      this.baseFormExample$ = this.getVerbExamples(verb, form);
    }
    return this.baseFormExample$;
  }

  getPastVerbExamples(verb: string, form: string): Observable<string> {
    if (!this.pastFormExample$) {
      this.pastFormExample$ = this.getVerbExamples(verb, form);
    }
    return this.pastFormExample$;
  }

  getParticipleVerbExamples(verb: string, form: string): Observable<string> {
    if (!this.participleFormExample$) {
      this.participleFormExample$ = this.getVerbExamples(verb, form);
    }
    return this.participleFormExample$;
  }
}
