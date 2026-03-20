import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, ReplaySubject, of } from 'rxjs';
import { catchError, distinctUntilChanged, map, shareReplay, switchMap } from 'rxjs/operators';
import {
  VerbDetails,
  VerbSearchOption,
  VerbDetailsDTO,
} from '../../model/verb-details';
import { ConfigService } from '../config/config.service';
import { Utils } from 'src/app/utils/utils';

@Injectable({
  providedIn: 'root',
})
export class VerbsService {
  private readonly httpClient = inject(HttpClient);
  private readonly configService = inject(ConfigService);

  /**
   * ReplaySubject(1) caches the most recent emission so that late subscribers
   * get the last value without triggering a new HTTP request.
   */
  private readonly verbsCache$ = new ReplaySubject<VerbDetails[]>(1);
  private verbsCacheLoaded = false;

  /**
   * BehaviorSubject drives the live search stream: each new term emission
   * is deduplicated and piped through the HTTP search call.
   */
  private readonly searchTerm$ = new BehaviorSubject<string>('');

  /**
   * Public search stream that debounces input and shares the result
   * across all subscribers using shareReplay.
   */
  readonly searchResults$: Observable<VerbSearchOption[]> =
    this.searchTerm$.pipe(
      distinctUntilChanged(),
      switchMap((term) => {
        if (term.length < 2) {
          return of([] as VerbSearchOption[]);
        }
        return this.httpClient
          .get<VerbSearchOption[]>('/api/verbs/', { params: { term } })
          .pipe(catchError(() => of([] as VerbSearchOption[])));
      }),
      shareReplay(1),
    );

  search(term: string): Observable<VerbSearchOption[]> {
    return this.httpClient.get<VerbSearchOption[]>(`/api/verbs/`, {
      params: { term },
    });
  }

  updateSearchTerm(term: string): void {
    this.searchTerm$.next(term);
  }

  getVerbsForGame(): Observable<VerbDetails[]> {
    return this.httpClient.get<VerbDetailsDTO[]>(`/api/verbs/game`).pipe(
      map((verbs: VerbDetailsDTO[]) => verbs.map(mapVerbDTO)),
    );
  }

  getAllVerbs(): Observable<VerbDetails[]> {
    if (!this.verbsCacheLoaded) {
      this.verbsCacheLoaded = true;
      this.httpClient
        .get<{ data: string }>(`/api/verbs/verbs`)
        .pipe(
          map(({ data }: { data: string }) =>
            Utils.decrypt(data, this.configService.apiKey),
          ),
          map((verbsJSON: string) => JSON.parse(verbsJSON) as VerbDetailsDTO[]),
          map((verbs) => verbs.map(mapVerbDTO)),
        )
        .subscribe({
          next: (verbs) => this.verbsCache$.next(verbs),
          error: (err: Error) => this.verbsCache$.error(err),
        });
    }
    return this.verbsCache$.asObservable();
  }
}

function mapVerbDTO({ id, base, pastSimple, pastParticiple }: VerbDetailsDTO): VerbDetails {
  return { id, base, pastSimple, pastParticiple };
}
