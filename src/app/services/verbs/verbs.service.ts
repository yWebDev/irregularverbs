import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  VerbDetails,
  VerbSearchOption,
  VerbDetailsDTO,
} from '../../model/verb-details';

@Injectable({
  providedIn: 'root',
})
export class VerbsService {
  private readonly httpClient = inject(HttpClient);

  search(term: string): Observable<VerbSearchOption[]> {
    return this.httpClient.get<VerbSearchOption[]>(`/api/verbs/`, {
      params: {
        term,
      },
    });
  }

  getVerbsForGame(): Observable<VerbDetails[]> {
    return this.httpClient.get<VerbDetailsDTO[]>(`/api/verbs/game`).pipe(
      map((verbs: VerbDetailsDTO[]) =>
        verbs.map(
          ({ id, base, pastSimple, pastParticiple }: VerbDetailsDTO) =>
            ({
              id,
              base,
              pastSimple,
              pastParticiple,
            }) as VerbDetails,
        ),
      ),
    );
  }
}
