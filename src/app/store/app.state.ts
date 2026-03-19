import { RouterReducerState } from '@ngrx/router-store';
import { AuthState } from './auth/auth.reducer';
import { GameState } from './game/game.reducer';
import { VerbsState } from './verbs/verbs.reducer';

export interface AppState {
  auth: AuthState;
  verbs: VerbsState;
  game: GameState;
  router: RouterReducerState;
}
