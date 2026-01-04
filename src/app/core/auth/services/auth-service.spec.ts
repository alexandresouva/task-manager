import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { AuthResponse } from '@shared/models/auth.model';

import { AuthService } from './auth-service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login with correct credentials', (done) => {
    let result: AuthResponse | null = null;
    service.login('fake@email.com', 'fakePassword').subscribe((response) => {
      result = response;
      done();
    });

    expect(result).toEqual({ token: 'fake_jwt_token' });
  });

  it('should throw an error with incorrect credentials', (done) => {
    const expectedError = {
      status: 401,
      statusText: 'Unauthorized',
      error: { message: 'Invalid credentials' },
    };
    let result: HttpErrorResponse | null = null;

    service.login('incorrect@email', 'incorrectPassword').subscribe({
      error: (error) => {
        result = error;
        done();
      },
    });

    expect(result.status).toEqual(expectedError.status);
    expect(result.statusText).toEqual(expectedError.statusText);
    expect(result.error.message).toEqual(expectedError.error.message);
  });

  it('should logout successfully', (done) => {
    let result: void | null = null;
    service.logout().subscribe(() => {
      result = void 0;
      done();
    });

    expect(result).toBeUndefined();
  });
});
