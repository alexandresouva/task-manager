import { HeaderUI } from '../support/ui/header.ui';
import { LoginPage } from '../support/pages/login.po';
import { setUserAsAuthenticated } from '../support/helpers/auth.helper';

describe('authentication', () => {
  let loginPage: LoginPage;
  let header: HeaderUI;

  beforeEach(() => {
    loginPage = new LoginPage();
    header = new HeaderUI();
  });

  context('when authentication succeeds', () => {
    beforeEach(() => {
      cy.visit('/');
      loginPage.loginWithValidCredentials();
    });

    it('should navigate to tasks page', () => {
      loginPage.assertOnTasksPage();
    });

    it('should display menu options', () => {
      header.assertProfileMenuVisible();
    });

    it('should allow user to logout', () => {
      header.logout();
      loginPage.assertOnLoginPage();
    });
  });

  context('when authentication fails', () => {
    beforeEach(() => {
      cy.visit('/');
      loginPage.loginWithInvalidCredentials();
    });

    it('should remain on login page', () => {
      loginPage.assertOnLoginPage();
    });

    it('should display authentication error message', () => {
      loginPage.assertLoginErrorVisible();
    });

    it('should not display menu options', () => {
      header.assertProfileMenuNotVisible();
    });
  });

  context('when user is already authenticated', () => {
    beforeEach(() => {
      setUserAsAuthenticated();
      cy.visit('/');
    });

    it('should redirect to tasks page', () => {
      loginPage.assertOnTasksPage();
    });

    it('should display menu options', () => {
      header.assertProfileMenuVisible();
    });
  });
});
