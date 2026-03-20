import { createReducer, on } from '@ngrx/store';
import { produce } from 'immer';
import { VerbDetails } from '../../model/verb-details';
import {
  loadVerbs,
  loadVerbsSuccess,
  loadVerbsFailure,
  loadGameVerbs,
  loadGameVerbsSuccess,
  loadGameVerbsFailure,
} from './verbs.actions';

export interface VerbsState {
  verbs: VerbDetails[];
  gameVerbs: VerbDetails[];
  loading: boolean;
  gameVerbsLoading: boolean;
  error: string | null;
}

export const verbsInitialState: VerbsState = {
  verbs: [],
  gameVerbs: [],
  loading: false,
  gameVerbsLoading: false,
  error: null,
};

export const verbsReducer = createReducer(
  verbsInitialState,

  on(loadVerbs, (state) =>
    produce(state, (draft) => {
      draft.loading = true;
      draft.error = null;
    }),
  ),

  on(loadVerbsSuccess, (state, { verbs }) =>
    produce(state, (draft) => {
      draft.verbs = verbs;
      draft.loading = false;
    }),
  ),

  on(loadVerbsFailure, (state, { error }) =>
    produce(state, (draft) => {
      draft.loading = false;
      draft.error = error;
    }),
  ),

  on(loadGameVerbs, (state) =>
    produce(state, (draft) => {
      draft.gameVerbsLoading = true;
      draft.error = null;
    }),
  ),

  on(loadGameVerbsSuccess, (state, { verbs }) =>
    produce(state, (draft) => {
      draft.gameVerbs = verbs;
      draft.gameVerbsLoading = false;
    }),
  ),

  on(loadGameVerbsFailure, (state, { error }) =>
    produce(state, (draft) => {
      draft.gameVerbsLoading = false;
      draft.error = error;
    }),
  ),
);
