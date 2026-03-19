import { createReducer, on } from '@ngrx/store';
import { produce } from 'immer';
import { login, logout } from './auth.actions';

export interface AuthState {
  username: string | null;
  isAuthorized: boolean;
}

const USERNAME_KEY = 'iv-username';

export const authInitialState: AuthState = {
  username: localStorage.getItem(USERNAME_KEY),
  isAuthorized: !!localStorage.getItem(USERNAME_KEY),
};

export const authReducer = createReducer(
  authInitialState,

  on(login, (state, { username }) =>
    produce(state, (draft) => {
      const trimmed = username.trim().toLowerCase();
      draft.username = trimmed;
      draft.isAuthorized = true;
      localStorage.setItem(USERNAME_KEY, trimmed);
    }),
  ),

  on(logout, (state) =>
    produce(state, (draft) => {
      draft.username = null;
      draft.isAuthorized = false;
      localStorage.removeItem(USERNAME_KEY);
    }),
  ),
);
