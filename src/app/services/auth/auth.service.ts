import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { login, logout } from '../../store/auth/auth.actions';
import { selectIsAuthorized, selectUsername } from '../../store/auth/auth.selectors';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly store = inject(Store);

  readonly username$: Observable<string | null> = this.store.select(selectUsername);
  readonly isAuthorized$: Observable<boolean> = this.store.select(selectIsAuthorized);

  get username(): string | null {
    return localStorage.getItem('iv-username');
  }

  isAuthorized(): boolean {
    return !!this.username;
  }

  login(username: string): void {
    this.store.dispatch(login({ username }));
  }

  delete(): void {
    this.store.dispatch(logout());
  }
}
