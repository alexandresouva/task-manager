import { inject, Injectable } from '@angular/core';

import { AuthStore } from '@shared/stores/auth-store';
import { catchError, map, Observable, tap, throwError } from 'rxjs';

import { AuthService } from './auth-service';
import { AuthStorageService } from './auth-storage-service';

@Injectable({
  providedIn: 'root',
})
export class AuthFacade {
  private readonly authService = inject(AuthService);
  private readonly authStore = inject(AuthStore);
  private readonly authStorage = inject(AuthStorageService);

  login(email: string, password: string): Observable<void> {
    return this.authService.login(email, password).pipe(
      tap(() => this.authStore.authenticate()),
      tap(({ token }) => this.authStorage.setToken(token)),
      map(() => void 0),
      catchError((error) => {
        this.authStore.logout();
        this.authStorage.clearToken();
        return throwError(() => error);
      }),
    );
  }

  restoreAuthState(): void {
    /* Please, don't repeat it! Only for example*/
    if (this.authStorage.hasToken()) {
      this.authStore.authenticate();
      return;
    }

    this.authStore.logout();
  }
}
