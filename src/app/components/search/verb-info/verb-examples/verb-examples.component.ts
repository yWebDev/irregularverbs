import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  SecurityContext,
  signal,
} from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { VerbDetails } from 'src/app/model/verb-details';
import { PromptService } from 'src/app/services/prompt/prompt.service';

@Component({
    selector: 'app-verb-examples',
    imports: [MatExpansionModule, AsyncPipe],
    templateUrl: './verb-examples.component.html',
    styleUrl: './verb-examples.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerbExamplesComponent {
  private readonly promptService = inject(PromptService);
  private readonly sanitizer = inject(DomSanitizer);

  details = input.required<VerbDetails>();

  panelOpenState = signal(false);

  baseFormExample$?: Observable<SafeHtml>;
  pastFormExample$?: Observable<SafeHtml>;
  participleFormExample$?: Observable<SafeHtml>;

  getVerbExamples(verb: string, form: string): Observable<SafeHtml> {
    return this.promptService.getVerbExamples(verb, form).pipe(
      map((resp) => {
        // Strip dangerous tags/attributes (scripts, event handlers) from
        // AI-generated content, then mark the sanitized result as trusted HTML
        // so Angular renders formatting tags like <b> and <i>.
        const sanitized = this.sanitizer.sanitize(SecurityContext.HTML, resp) ?? '';
        return this.sanitizer.bypassSecurityTrustHtml(sanitized);
      }),
      shareReplay(1),
    );
  }

  getBaseVerbExamples(verb: string, form: string): Observable<SafeHtml> {
    if (!this.baseFormExample$) {
      this.baseFormExample$ = this.getVerbExamples(verb, form);
    }
    return this.baseFormExample$;
  }

  getPastVerbExamples(verb: string, form: string): Observable<SafeHtml> {
    if (!this.pastFormExample$) {
      this.pastFormExample$ = this.getVerbExamples(verb, form);
    }
    return this.pastFormExample$;
  }

  getParticipleVerbExamples(verb: string, form: string): Observable<SafeHtml> {
    if (!this.participleFormExample$) {
      this.participleFormExample$ = this.getVerbExamples(verb, form);
    }
    return this.participleFormExample$;
  }
}
