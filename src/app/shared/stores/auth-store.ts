import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  private readonly _isAuthenticated = signal(false);

  get isAuthenticated(): boolean {
    return this._isAuthenticated();
  }

  set isAuthenticated(value: boolean) {
    this._isAuthenticated.set(value);
  }
}
