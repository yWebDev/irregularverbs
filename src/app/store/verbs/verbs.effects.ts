import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { VerbDetails } from '../../model/verb-details';
import { VerbsService } from '../../services/verbs/verbs.service';
import {
  loadVerbs,
  loadVerbsSuccess,
  loadVerbsFailure,
  loadGameVerbs,
  loadGameVerbsSuccess,
  loadGameVerbsFailure,
} from './verbs.actions';

@Injectable()
export class VerbsEffects {
  private readonly actions$ = inject(Actions);
  private readonly verbsService = inject(VerbsService);

  loadVerbs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadVerbs),
      switchMap(() =>
        this.verbsService.getAllVerbs().pipe(
          map((verbs: VerbDetails[]) => loadVerbsSuccess({ verbs })),
          catchError((err: Error) =>
            of(loadVerbsFailure({ error: err.message ?? 'Failed to load verbs' })),
          ),
        ),
      ),
    ),
  );

  loadGameVerbs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadGameVerbs),
      switchMap(() =>
        this.verbsService.getVerbsForGame().pipe(
          map((verbs: VerbDetails[]) => loadGameVerbsSuccess({ verbs })),
          catchError((err: Error) =>
            of(loadGameVerbsFailure({ error: err.message ?? 'Failed to load game verbs' })),
          ),
        ),
      ),
    ),
  );
}
