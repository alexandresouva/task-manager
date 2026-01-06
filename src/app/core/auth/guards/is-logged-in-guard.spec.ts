import { Location } from '@angular/common';
import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CanActivateFn, provideRouter, Router } from '@angular/router';

import { AuthStore } from '@core/auth/stores/auth-store';
import { MockService } from 'ng-mocks';

import { isLoggedInGuard } from './is-logged-in-guard';

@Component({
  selector: 'app-test',
  template: '',
})
class FakeAuthenticatedComponent {}

@Component({
  selector: 'app-test',
  template: '',
})
class FakeLoginComponent {}

type SetupParams = {
  isAuthenticated: boolean;
};

function setup({ isAuthenticated = false }: SetupParams) {
  const authStoreMock = MockService(AuthStore) as jest.Mocked<AuthStore>;

  Object.defineProperty(authStoreMock, 'isAuthenticated', {
    value: signal(isAuthenticated),
  });

  TestBed.configureTestingModule({
    providers: [
      provideRouter([
        {
          path: 'authenticated-route',
          component: FakeAuthenticatedComponent,
          canActivate: [isLoggedInGuard],
        },
        {
          path: 'login',
          component: FakeLoginComponent,
        },
      ]),
      { provide: AuthStore, useValue: authStoreMock },
    ],
  });

  return { authStoreMock };
}

describe('isLoggedInGuard', () => {
  it('should be created', () => {
    const executeGuard: CanActivateFn = (...guardParameters) =>
      TestBed.runInInjectionContext(() => isLoggedInGuard(...guardParameters));
    expect(executeGuard).toBeTruthy();
  });

  describe('when user is authenticated', () => {
    it('should allow access to routes that require authentication', async () => {
      setup({ isAuthenticated: true });
      const location = TestBed.inject(Location);
      const router = TestBed.inject(Router);

      expect(location.path()).toBe('');

      await router.navigateByUrl('/authenticated-route');

      expect(location.path()).toBe('/authenticated-route');
    });
  });

  describe('when user is not authenticated', () => {
    it('should redirect to login when accessing routes that require authentication', async () => {
      setup({ isAuthenticated: false });
      const location = TestBed.inject(Location);
      const router = TestBed.inject(Router);

      expect(location.path()).toBe('');

      await router.navigateByUrl('/authenticated-route');

      expect(location.path()).toBe('/login');
    });
  });
});
