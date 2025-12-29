import { TestBed } from '@angular/core/testing';

import { AuthService } from '@shared/services/auth-service';
import { TestHelper } from '@testing/helpers/test-helper';
import { MockService } from 'ng-mocks';
import { of } from 'rxjs';

import { Login } from './login';

function setup() {
  const authServiceMock = MockService(AuthService) as jest.Mocked<AuthService>;

  TestBed.configureTestingModule({
    imports: [Login],
    providers: [{ provide: AuthService, useValue: authServiceMock }],
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
    it('should call service with credentials', () => {
      const { testHelper, authServiceMock } = setup();

      authServiceMock.login.mockReturnValue(of({ token: 'fake_jwt_token' }));
      fillAndSubmitForm(testHelper, validEmail, validPassword);

      expect(authServiceMock.login).toHaveBeenCalledWith(
        validEmail,
        validPassword,
      );
    });

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
    it('should display error if both fields are invalid', () => {
      const { testHelper, fixture, authServiceMock } = setup();

      fillAndSubmitForm(testHelper, '', '');
      fixture.detectChanges();

      const { emailError, passwordError } = getErrorMessages(testHelper);

      expect(emailError).toBeTruthy();
      expect(passwordError).toBeTruthy();
      expect(authServiceMock.login).not.toHaveBeenCalled();
    });

    it('should display error only for invalid field', () => {
      const { testHelper, fixture, authServiceMock } = setup();

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
      expect(authServiceMock.login).not.toHaveBeenCalled();
    });
  });
});
