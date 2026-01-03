import { inject, Injectable } from '@angular/core';

import { LOCAL_STORAGE } from '@shared/tokens/local-storage.token';

@Injectable({
  providedIn: 'root',
})
export class AuthStorageService {
  private readonly localStorage = inject(LOCAL_STORAGE);

  readonly #tokenKey = 'auth_token';

  setToken(token: string): void {
    this.localStorage.setItem(this.#tokenKey, token);
  }

  getToken(): string | null {
    return this.localStorage.getItem(this.#tokenKey);
  }

  hasToken(): boolean {
    return Boolean(this.getToken());
  }

  clearToken(): void {
    this.localStorage.removeItem(this.#tokenKey);
  }
}
