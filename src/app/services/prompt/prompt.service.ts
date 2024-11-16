import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PromptService {
  private httpClient = inject(HttpClient);

  getVerbExamples(verb: string, form: string): Observable<string> {
    return this.httpClient
      .get<string>(`/api/ai/prompt`, {
        params: {
          verb,
          form,
        },
      })
      .pipe(
        map((res: string) => {
          console.log(res);
          return res as string;
        }),
      );
  }
}
