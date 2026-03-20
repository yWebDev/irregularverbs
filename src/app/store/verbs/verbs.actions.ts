import { createAction, props } from '@ngrx/store';
import { VerbDetails } from '../../model/verb-details';

export const loadVerbs = createAction('[Verbs] Load Verbs');

export const loadVerbsSuccess = createAction(
  '[Verbs] Load Verbs Success',
  props<{ verbs: VerbDetails[] }>(),
);

export const loadVerbsFailure = createAction(
  '[Verbs] Load Verbs Failure',
  props<{ error: string }>(),
);

export const loadGameVerbs = createAction('[Verbs] Load Game Verbs');

export const loadGameVerbsSuccess = createAction(
  '[Verbs] Load Game Verbs Success',
  props<{ verbs: VerbDetails[] }>(),
);

export const loadGameVerbsFailure = createAction(
  '[Verbs] Load Game Verbs Failure',
  props<{ error: string }>(),
);
