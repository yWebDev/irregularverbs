import { createAction, props } from '@ngrx/store';

export const startGame = createAction('[Game] Start Game');

export const incrementScore = createAction('[Game] Increment Score');

export const updateTime = createAction(
  '[Game] Update Time',
  props<{ time: string }>(),
);

export const endGame = createAction(
  '[Game] End Game',
  props<{ time: string; isCompleted: boolean }>(),
);

export const resetGame = createAction('[Game] Reset Game');
