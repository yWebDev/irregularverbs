import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VerbDetailsDTO } from 'src/app/model/verb-details';

@Injectable({
  providedIn: 'root',
})
export class PromptService {
  private httpClient = inject(HttpClient);

  getVerbExamples(verb: string, form: string): Observable<string> {
    return this.httpClient.get<string>(`/api/ai/prompt`, {
      params: {
        verb,
        form,
      },
    });
  }

  getVerbFormsExamples(verb: VerbDetailsDTO): Observable<string> {
    return this.httpClient.post<string>(`/api/ai/prompt-forms`, {
      params: {
        verb,
      },
    });
  }
}
