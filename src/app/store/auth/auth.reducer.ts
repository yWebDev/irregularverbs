import { createReducer, on } from '@ngrx/store';
import { produce } from 'immer';
import { login, logout } from './auth.actions';

export interface AuthState {
  username: string | null;
  isAuthorized: boolean;
}

const USERNAME_KEY = 'iv-username';

const isBrowserStorage = typeof localStorage !== 'undefined';

export const authInitialState: AuthState = {
  username: isBrowserStorage ? localStorage.getItem(USERNAME_KEY) : null,
  isAuthorized: isBrowserStorage ? !!localStorage.getItem(USERNAME_KEY) : false,
};

export const authReducer = createReducer(
  authInitialState,

  on(login, (state, { username }) =>
    produce(state, (draft) => {
      const trimmed = username.trim().toLowerCase();
      draft.username = trimmed;
      draft.isAuthorized = true;
      if (isBrowserStorage) {
        localStorage.setItem(USERNAME_KEY, trimmed);
      }
    }),
  ),

  on(logout, (state) =>
    produce(state, (draft) => {
      draft.username = null;
      draft.isAuthorized = false;
      if (isBrowserStorage) {
        localStorage.removeItem(USERNAME_KEY);
      }
    }),
  ),
);
