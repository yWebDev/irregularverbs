import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VerbDetails } from '../../model/verb-details';

@Injectable({
  providedIn: 'root'
})
export class VerbsService {

  constructor(private httpClient: HttpClient) { }

  search(term: string): Observable<VerbDetails[]> {
    return this.httpClient.get<VerbDetails[]>(`/api/verbs/${term}`);
  }
}
