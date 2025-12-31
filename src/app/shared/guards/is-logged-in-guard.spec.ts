import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CanActivateFn, provideRouter, Router } from '@angular/router';

import { AuthStore } from '@shared/stores/auth-store';
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

function setup() {
  const authStoreMock = MockService(AuthStore) as jest.Mocked<AuthStore>;

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
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => isLoggedInGuard(...guardParameters));

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  describe('when user is authenticated', () => {
    it('should allow access to routes that require authentication', async () => {
      const { authStoreMock } = setup();
      const location = TestBed.inject(Location);
      const router = TestBed.inject(Router);

      expect(location.path()).toBe('');

      jest.spyOn(authStoreMock, 'isAuthenticated', 'get').mockReturnValue(true);
      await router.navigateByUrl('/authenticated-route');

      expect(location.path()).toBe('/authenticated-route');
    });
  });

  describe('when user is not authenticated', () => {
    it('should redirect to login when accessing routes that require authentication', async () => {
      const { authStoreMock } = setup();
      const location = TestBed.inject(Location);
      const router = TestBed.inject(Router);

      expect(location.path()).toBe('');

      jest
        .spyOn(authStoreMock, 'isAuthenticated', 'get')
        .mockReturnValue(false);
      await router.navigateByUrl('/authenticated-route');

      expect(location.path()).toBe('/login');
    });
  });
});
