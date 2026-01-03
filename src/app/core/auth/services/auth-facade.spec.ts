import { TestBed } from '@angular/core/testing';

import { AuthResponse } from '@shared/models/auth.model';
import { AuthStore } from '@shared/stores/auth-store';
import { MockService } from 'ng-mocks';
import { of, throwError } from 'rxjs';

import { AuthFacade } from './auth-facade';
import { AuthService } from './auth-service';
import { AuthStorageService } from './auth-storage-service';

function setup() {
  const authServiceMock = MockService(AuthService) as jest.Mocked<AuthService>;
  const authStoreMock = MockService(AuthStore) as jest.Mocked<AuthStore>;
  const authStorageMock = MockService(
    AuthStorageService,
  ) as jest.Mocked<AuthStorageService>;

  TestBed.configureTestingModule({
    providers: [
      { provide: AuthService, useValue: authServiceMock },
      { provide: AuthStore, useValue: authStoreMock },
      { provide: AuthStorageService, useValue: authStorageMock },
    ],
  });
  const service = TestBed.inject(AuthFacade);

  return { service, authServiceMock, authStoreMock, authStorageMock };
}

describe('AuthFacade', () => {
  it('should be created', () => {
    const { service } = setup();
    expect(service).toBeTruthy();
  });

  describe('when login is successful', () => {
    it('should authenticate and save auth token', (done) => {
      const { service, authServiceMock, authStoreMock, authStorageMock } =
        setup();
      const fakeEmail = 'fake@email.com';
      const fakePassword = 'fakePassword';
      const fakeAuthResponse: AuthResponse = {
        token: 'fake_jwt_token',
      };

      authServiceMock.login.mockReturnValue(of(fakeAuthResponse));
      service.login(fakeEmail, fakePassword).subscribe(() => {
        done();
      });

      expect(authServiceMock.login).toHaveBeenCalledWith(
        fakeEmail,
        fakePassword,
      );
      expect(authStoreMock.authenticate).toHaveBeenCalled();
      expect(authStorageMock.setToken).toHaveBeenCalledWith('fake_jwt_token');
    });
  });

  describe('when login fails', () => {
    it('should logout, clear auth token and throw an error', (done) => {
      const { service, authServiceMock, authStoreMock, authStorageMock } =
        setup();
      const fakeEmail = 'fake@email.com';
      const fakePassword = 'fakePassword';

      authServiceMock.login.mockReturnValue(
        throwError(() => new Error('Login failed')),
      );

      let expectedError: Error | null = null;
      service.login(fakeEmail, fakePassword).subscribe({
        error: (error) => {
          expectedError = error;
          done();
        },
      });

      expect(expectedError).toBeTruthy();
      expect(expectedError?.message).toBe('Login failed');
      expect(authStoreMock.logout).toHaveBeenCalled();
      expect(authStorageMock.clearToken).toHaveBeenCalled();
    });
  });

  describe('when restoring auth state', () => {
    it('should authenticate if auth token is present', () => {
      const { service, authStoreMock, authStorageMock } = setup();

      authStorageMock.hasToken.mockReturnValue(true);
      service.restoreAuthState();

      expect(authStorageMock.hasToken).toHaveBeenCalled();
      expect(authStoreMock.authenticate).toHaveBeenCalled();
    });

    it('should logout if auth token is absent', () => {
      const { service, authStoreMock, authStorageMock } = setup();

      authStorageMock.hasToken.mockReturnValue(false);
      service.restoreAuthState();

      expect(authStorageMock.hasToken).toHaveBeenCalled();
      expect(authStoreMock.logout).toHaveBeenCalled();
    });
  });
});
