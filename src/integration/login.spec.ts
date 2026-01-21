import { Location } from '@angular/common';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingHarness } from '@angular/router/testing';

import { submitLoginForm } from '@testing/helpers/login.helper';
import { setAuthToken } from '@testing/helpers/set-auth-token.helper';
import { TestHelper } from '@testing/test-helper/test-helper';
import { appConfig } from 'src/app/app.config';

function setup() {
  TestBed.configureTestingModule({
    providers: [appConfig.providers],
  });
}

describe('Login', () => {
  beforeEach(() => localStorage.clear());

  describe('when user is not authenticated', () => {
    it('should redirect to login and then to tasks after successful login', fakeAsync(async () => {
      setup();

      const location = TestBed.inject(Location);
      expect(location.path()).toBe('');

      const harness = await RouterTestingHarness.create('');
      const testHelper = new TestHelper(harness.fixture);

      expect(location.path()).toBe('/login');

      submitLoginForm(testHelper, {
        email: 'fake@email.com',
        password: 'fakePassword',
      });

      tick();

      expect(location.path()).toBe('/tasks');
    }));

    it('should redirect to login and keep in the same page if login fails', fakeAsync(async () => {
      setup();

      const location = TestBed.inject(Location);
      expect(location.path()).toBe('');

      const harness = await RouterTestingHarness.create('');
      const testHelper = new TestHelper(harness.fixture);

      expect(location.path()).toBe('/login');

      submitLoginForm(testHelper, {
        email: 'fake@email.com',
        password: 'wrongPassword',
      });

      tick();

      expect(location.path()).toBe('/login');
    }));
  });

  describe('when user is already authenticated', () => {
    beforeEach(() => setAuthToken());

    it('should redirect to tasks on app load', async () => {
      setup();

      const location = TestBed.inject(Location);
      expect(location.path()).toBe('');

      await RouterTestingHarness.create('');

      expect(location.path()).toBe('/tasks');
    });
  });
});
