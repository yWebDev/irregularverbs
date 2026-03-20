import { createFeatureSelector, createSelector } from '@ngrx/store';
import { VerbsState } from './verbs.reducer';

export const selectVerbsState = createFeatureSelector<VerbsState>('verbs');

export const selectAllVerbs = createSelector(
  selectVerbsState,
  (state) => state.verbs,
);

export const selectGameVerbs = createSelector(
  selectVerbsState,
  (state) => state.gameVerbs,
);

export const selectVerbsLoading = createSelector(
  selectVerbsState,
  (state) => state.loading,
);

export const selectGameVerbsLoading = createSelector(
  selectVerbsState,
  (state) => state.gameVerbsLoading,
);

export const selectVerbsError = createSelector(
  selectVerbsState,
  (state) => state.error,
);
