import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GameState } from './game.reducer';

export const selectGameState = createFeatureSelector<GameState>('game');

export const selectGameScore = createSelector(
  selectGameState,
  (state) => state.score,
);

export const selectGameMaxRounds = createSelector(
  selectGameState,
  (state) => state.maxRounds,
);

export const selectIsGameOver = createSelector(
  selectGameState,
  (state) => state.isGameOver,
);

export const selectIsGameCompleted = createSelector(
  selectGameState,
  (state) => state.isCompleted,
);

export const selectIsGameActive = createSelector(
  selectGameState,
  (state) => state.isActive,
);

export const selectGameTime = createSelector(
  selectGameState,
  (state) => state.time,
);

export const selectGameHistory = createSelector(
  selectGameState,
  (state) => state.history,
);
