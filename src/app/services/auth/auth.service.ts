import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly USERNAME_KEY = 'iv-username';

  constructor() {}

  get username(): string | null {
    return localStorage.getItem(this.USERNAME_KEY);
  }

  isAuthorized(): boolean {
    return !!this.username;
  }

  login(username: string): void {
    localStorage.setItem(this.USERNAME_KEY, username.trim().toLowerCase());
  }

  delete(): void {
    localStorage.removeItem(this.USERNAME_KEY);
  }
}
