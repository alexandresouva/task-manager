import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { List } from '@pages/list/list';
import { AuthFacade } from '@shared/services/auth-facade';
import { ToastService } from '@shared/services/toast-service';
import { TestHelper } from '@testing/helpers/test-helper';
import { MockComponent, MockService } from 'ng-mocks';
import { of, throwError } from 'rxjs';

import { Login } from './login';

function setup() {
  const authFacadeMock = MockService(AuthFacade) as jest.Mocked<AuthFacade>;
  const toastServiceMock = MockService(
    ToastService,
  ) as jest.Mocked<ToastService>;

  TestBed.configureTestingModule({
    imports: [Login],
    providers: [
      provideRouter([{ path: 'tasks', component: MockComponent(List) }]),
      { provide: AuthFacade, useValue: authFacadeMock },
      { provide: ToastService, useValue: toastServiceMock },
    ],
  });

  const fixture = TestBed.createComponent(Login);
  const component = fixture.componentInstance;
  const testHelper = new TestHelper(fixture);

  fixture.detectChanges();

  return {
    fixture,
    component,
    testHelper,
    authFacadeMock,
    toastServiceMock,
  };
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

function getEmailErrorMessage(testHelper: TestHelper<Login>) {
  let emailError: string | null = null;

  try {
    emailError = testHelper.getTextContentByTestId('login-email-error');
  } catch {
    emailError = null;
  }

  return { emailError };
}

describe('Login', () => {
  const validEmail = 'fake@email.com';
  const validPassword = 'fakePassword';

  it('should create', () => {
    const { component } = setup();
    expect(component).toBeTruthy();
  });

  describe('when form is valid and submitted', () => {
    it('should not display email error message', () => {
      const { testHelper, fixture, authFacadeMock } = setup();

      authFacadeMock.login.mockReturnValue(of(void 0));
      fillAndSubmitForm(testHelper, validEmail, validPassword);
      fixture.detectChanges();

      const { emailError } = getEmailErrorMessage(testHelper);

      expect(emailError).toBeFalsy();
    });

    it('should login and navigate to tasks page if success', fakeAsync(() => {
      const { testHelper, authFacadeMock } = setup();
      const location = TestBed.inject(Location);

      authFacadeMock.login.mockReturnValue(of(void 0));
      fillAndSubmitForm(testHelper, validEmail, validPassword);

      expect(authFacadeMock.login).toHaveBeenCalledWith(
        validEmail,
        validPassword,
      );

      tick();

      expect(location.path()).toBe('/tasks');
    }));

    it('should display toast error and keep on login page if login fails', fakeAsync(() => {
      const { testHelper, authFacadeMock, toastServiceMock } = setup();
      const location = TestBed.inject(Location);
      const unauthorizedFakeError = new HttpErrorResponse({
        status: 401,
        statusText: 'Unauthorized',
        error: { message: 'Invalid credentials' },
      });

      authFacadeMock.login.mockReturnValue(
        throwError(() => unauthorizedFakeError),
      );
      fillAndSubmitForm(testHelper, validEmail, validPassword);

      expect(authFacadeMock.login).toHaveBeenCalledWith(
        validEmail,
        validPassword,
      );

      tick();

      expect(location.path()).toBe('');
      expect(toastServiceMock.show).toHaveBeenCalledWith({
        type: 'error',
        title: 'Error',
        message: 'Invalid email or password.',
      });
    }));

    it('should display generic toast error if a different error occurs', fakeAsync(() => {
      const { testHelper, authFacadeMock, toastServiceMock } = setup();
      const location = TestBed.inject(Location);
      const serverFakeError = new HttpErrorResponse({
        status: 500,
        statusText: 'Server Error',
      });

      authFacadeMock.login.mockReturnValue(throwError(() => serverFakeError));
      fillAndSubmitForm(testHelper, validEmail, validPassword);

      expect(authFacadeMock.login).toHaveBeenCalledWith(
        validEmail,
        validPassword,
      );

      tick();

      expect(location.path()).toBe('');
      expect(toastServiceMock.show).toHaveBeenCalledWith({
        type: 'error',
        title: 'Error',
        message: 'An error occurred during login. Please try again later.',
      });
    }));
  });

  describe('when form is invalid', () => {
    it('should display error if email is in invalid format', () => {
      const { testHelper, fixture } = setup();

      fillAndSubmitForm(testHelper, '', '');
      fixture.detectChanges();

      const { emailError } = getEmailErrorMessage(testHelper);

      expect(emailError).toBeTruthy();
    });

    it('should prevent login submission', () => {
      const { testHelper, fixture, authFacadeMock } = setup();
      const location = TestBed.inject(Location);
      const loginButton = testHelper.queryByTestId('login-button');

      fillAndSubmitForm(testHelper, '', '123');
      fixture.detectChanges();

      expect(loginButton.nativeElement.disabled).toBe(true);
      expect(authFacadeMock.login).not.toHaveBeenCalled();
      expect(location.path()).toBe('');
    });
  });
});
