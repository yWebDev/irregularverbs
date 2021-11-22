import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VerbSearchOption } from '../../model/verb-details';

@Injectable({
  providedIn: 'root'
})
export class VerbsService {

  constructor(private httpClient: HttpClient) { }

  search(term: string): Observable<VerbSearchOption[]> {
    return this.httpClient.get<VerbSearchOption[]>(`/api/verbs/`, {
      params: {
        term
      }
    });
  }
}
