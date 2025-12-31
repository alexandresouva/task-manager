import { Location } from '@angular/common';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { List } from '@pages/list/list';
import { AuthService } from '@shared/services/auth-service';
import { TestHelper } from '@testing/helpers/test-helper';
import { MockComponent, MockService } from 'ng-mocks';
import { of } from 'rxjs';

import { Login } from './login';

function setup() {
  const authServiceMock = MockService(AuthService) as jest.Mocked<AuthService>;

  TestBed.configureTestingModule({
    imports: [Login],
    providers: [
      { provide: AuthService, useValue: authServiceMock },
      provideRouter([{ path: 'tasks', component: MockComponent(List) }]),
    ],
  });

  const fixture = TestBed.createComponent(Login);
  const component = fixture.componentInstance;
  const testHelper = new TestHelper(fixture);

  fixture.detectChanges();

  return { fixture, component, testHelper, authServiceMock };
}

function fillAndSubmitForm(
  testHelper: TestHelper<Login>,
  email: string,
  password: string,
) {
  testHelper.triggerInputByTestId('login-email', email);
  testHelper.triggerInputByTestId('login-password', password);
  testHelper.dispatchSubmitEventByTestId('login-button');
}

function getErrorMessages(testHelper: TestHelper<Login>) {
  let emailError: string | null = null;
  let passwordError: string | null = null;

  try {
    emailError = testHelper.getTextContentByTestId('login-email-error');
  } catch {
    emailError = null;
  }

  try {
    passwordError = testHelper.getTextContentByTestId('login-password-error');
  } catch {
    passwordError = null;
  }

  return { emailError, passwordError };
}

describe('Login', () => {
  const validEmail = 'fake@email.com';
  const validPassword = 'fakePassword';

  it('should create', () => {
    const { component } = setup();
    expect(component).toBeTruthy();
  });

  describe('when submit valid login credentials', () => {
    it('should login and navigate to tasks page', fakeAsync(() => {
      const { testHelper, authServiceMock } = setup();
      const location = TestBed.inject(Location);

      authServiceMock.login.mockReturnValue(of({ token: 'fake_jwt_token' }));
      fillAndSubmitForm(testHelper, validEmail, validPassword);

      expect(authServiceMock.login).toHaveBeenCalledWith(
        validEmail,
        validPassword,
      );

      tick();

      expect(location.path()).toBe('/tasks');
    }));

    it('should NOT display error messages', () => {
      const { testHelper, fixture, authServiceMock } = setup();

      authServiceMock.login.mockReturnValue(of({ token: 'fake_jwt_token' }));
      fillAndSubmitForm(testHelper, validEmail, validPassword);
      fixture.detectChanges();

      const { emailError, passwordError } = getErrorMessages(testHelper);

      expect(emailError).toBeFalsy();
      expect(passwordError).toBeFalsy();
    });
  });

  describe('when submit invalid login credentials', () => {
    it('should interrupt login', () => {
      const { testHelper, fixture, authServiceMock } = setup();
      const location = TestBed.inject(Location);

      fillAndSubmitForm(testHelper, '', '');
      fixture.detectChanges();

      expect(authServiceMock.login).not.toHaveBeenCalled();
      expect(location.path()).toBe('');
    });

    it('should display error if both fields are invalid', () => {
      const { testHelper, fixture } = setup();

      fillAndSubmitForm(testHelper, '', '');
      fixture.detectChanges();

      const { emailError, passwordError } = getErrorMessages(testHelper);

      expect(emailError).toBeTruthy();
      expect(passwordError).toBeTruthy();
    });

    it('should display error only for invalid field', () => {
      const { testHelper, fixture } = setup();

      fillAndSubmitForm(testHelper, validEmail, '');
      fixture.detectChanges();

      let { emailError, passwordError } = getErrorMessages(testHelper);

      expect(emailError).toBeFalsy();
      expect(passwordError).toBeTruthy();

      fillAndSubmitForm(testHelper, 'invalidEmailFormat', validPassword);
      fixture.detectChanges();

      ({ emailError, passwordError } = getErrorMessages(testHelper));

      expect(emailError).toBeTruthy();
      expect(passwordError).toBeFalsy();
    });
  });
});
