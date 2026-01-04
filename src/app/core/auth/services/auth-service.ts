import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthResponse } from '@shared/models/auth.model';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /* Please, don't repeat it! Only for example*/
  private readonly correctCredentials = {
    email: 'fake@email.com',
    password: 'fakePassword',
  };

  login(email: string, password: string): Observable<AuthResponse> {
    if (
      email !== this.correctCredentials.email ||
      password !== this.correctCredentials.password
    ) {
      return throwError(
        () =>
          new HttpErrorResponse({
            status: 401,
            statusText: 'Unauthorized',
            error: { message: 'Invalid credentials' },
          }),
      );
    }

    return of({ token: 'fake_jwt_token' });
  }

  logout(): Observable<void> {
    return of(void 0);
  }
}
