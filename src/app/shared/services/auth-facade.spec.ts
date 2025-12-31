import { TestBed } from '@angular/core/testing';

import { AuthStore } from '@shared/stores/auth-store';
import { MockService } from 'ng-mocks';
import { of, throwError } from 'rxjs';

import { AuthFacade } from './auth-facade';
import { AuthService } from './auth-service';

function setup() {
  const authServiceMock = MockService(AuthService) as jest.Mocked<AuthService>;
  const authStoreMock = MockService(AuthStore) as jest.Mocked<AuthStore>;

  TestBed.configureTestingModule({
    providers: [
      { provide: AuthService, useValue: authServiceMock },
      { provide: AuthStore, useValue: authStoreMock },
    ],
  });
  const service = TestBed.inject(AuthFacade);

  return { service, authServiceMock, authStoreMock };
}

describe('AuthFacade', () => {
  it('should be created', () => {
    const { service } = setup();
    expect(service).toBeTruthy();
  });

  describe('when login is successful', () => {
    it('should set isAuthenticated to true ', (done) => {
      const { service, authServiceMock, authStoreMock } = setup();
      const fakeEmail = 'fake@email.com';
      const fakePassword = 'fakePassword';

      authServiceMock.login.mockReturnValue(of(void 0));
      service.login(fakeEmail, fakePassword).subscribe(() => {
        done();
      });

      expect(authServiceMock.login).toHaveBeenCalledWith(
        fakeEmail,
        fakePassword,
      );
      expect(authStoreMock.isAuthenticated).toBe(true);
    });
  });

  describe('when login fails', () => {
    it('should set isAuthenticated to false and throw an error', (done) => {
      const { service, authServiceMock, authStoreMock } = setup();
      const fakeEmail = 'fake@email.com';
      const fakePassword = 'fakePassword';

      authServiceMock.login.mockReturnValue(
        throwError(() => new Error('Login failed')),
      );

      let result: Error | null = null;
      service.login(fakeEmail, fakePassword).subscribe({
        error: (error) => {
          result = error;
          done();
        },
      });

      expect(result).toBeTruthy();
      expect(result?.message).toBe('Login failed');
      expect(authStoreMock.isAuthenticated).toBe(false);
    });
  });
});
