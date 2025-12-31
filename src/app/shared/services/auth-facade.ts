import { inject, Injectable } from '@angular/core';

import { AuthStore } from '@shared/stores/auth-store';
import { catchError, map, Observable, tap, throwError } from 'rxjs';

import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root',
})
export class AuthFacade {
  private readonly authService = inject(AuthService);
  private readonly authStore = inject(AuthStore);

  login(email: string, password: string): Observable<void> {
    return this.authService.login(email, password).pipe(
      tap(() => (this.authStore.isAuthenticated = true)),
      map(() => void 0),
      catchError((error) => {
        this.authStore.isAuthenticated = false;
        return throwError(() => error);
      }),
    );
  }
}
