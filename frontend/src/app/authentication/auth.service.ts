import { Injectable, signal } from "@angular/core";
import {JWT} from './auth.types';

@Injectable(
  {providedIn: 'root'}
)
export class AuthService {
  private token = signal<JWT | null>(null);
  private isLoggedIn = signal(false)

  setToken(token: JWT) {
    if (token) {
      this.token.set(token);
      this.isLoggedIn.set(true);
    }
  }

  getToken(): JWT | null {
    return this.token();
  }

  logout() {
    this.token.set(null);
    this.isLoggedIn.set(false);
  }
}
