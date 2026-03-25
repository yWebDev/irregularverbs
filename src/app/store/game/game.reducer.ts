import { createReducer, on } from '@ngrx/store';
import { produce } from 'immer';
import { endGame, incrementScore, resetGame, startGame, updateTime } from './game.actions';

export interface GameResult {
  score: number;
  time: string;
  date: string;
  isCompleted: boolean;
}

export interface GameState {
  score: number;
  maxRounds: number;
  isGameOver: boolean;
  isCompleted: boolean;
  isActive: boolean;
  time: string;
  history: GameResult[];
}

const isBrowserStorage = typeof localStorage !== 'undefined';

export const gameInitialState: GameState = {
  score: 0,
  maxRounds: 50,
  isGameOver: false,
  isCompleted: false,
  isActive: false,
  time: '00:00:00',
  history: isBrowserStorage
    ? (JSON.parse(localStorage.getItem('iv-game-history') ?? '[]') as GameResult[])
    : [],
};

export const gameReducer = createReducer(
  gameInitialState,

  on(startGame, (state) =>
    produce(state, (draft) => {
      draft.score = 0;
      draft.isGameOver = false;
      draft.isCompleted = false;
      draft.isActive = true;
      draft.time = '00:00:00';
    }),
  ),

  on(incrementScore, (state) =>
    produce(state, (draft) => {
      draft.score += 1;
    }),
  ),

  on(updateTime, (state, { time }) =>
    produce(state, (draft) => {
      draft.time = time;
    }),
  ),

  on(endGame, (state, { time, isCompleted }) =>
    produce(state, (draft) => {
      draft.isGameOver = true;
      draft.isCompleted = isCompleted;
      draft.isActive = false;
      draft.time = time;

      const result: GameResult = {
        score: draft.score,
        time,
        date: new Date().toISOString(),
        isCompleted,
      };

      draft.history.unshift(result);
      if (draft.history.length > 10) {
        draft.history.length = 10;
      }

      if (isBrowserStorage) {
        localStorage.setItem('iv-game-history', JSON.stringify(draft.history));
      }
    }),
  ),

  on(resetGame, (state) =>
    produce(state, (draft) => {
      draft.score = 0;
      draft.isGameOver = false;
      draft.isCompleted = false;
      draft.isActive = false;
      draft.time = '00:00:00';
    }),
  ),
);
