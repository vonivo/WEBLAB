import { Injectable, computed, signal } from '@angular/core';
import { JWT } from './auth.types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly token = signal<JWT | null>(this.loadToken());
  readonly isLoggedIn = computed(() => this.token() !== null);
  readonly accessToken = computed(() => this.token()?.accessToken ?? null);

  setToken(token: JWT): void {
    this.token.set(token);
    localStorage.setItem('auth', JSON.stringify(token));
  }

  getToken(): JWT | null {
    return this.token();
  }

  logout(): void {
    this.token.set(null);
    localStorage.removeItem('auth');
  }

  private loadToken(): JWT | null {
    const stored = localStorage.getItem('auth');

    if (!stored) {
      return null;
    }

    try {
      return JSON.parse(stored) as JWT;
    } catch {
      localStorage.removeItem('auth');
      return null;
    }
  }
}
