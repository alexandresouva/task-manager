import { HeaderUI } from '../support/ui/header.ui';
import { LoginPage } from '../support/pages/login.po';
import { setUserAsAuthenticated } from '../support/helpers/auth.helper';

describe('auth flow', () => {
  context('when not logged in', () => {
    beforeEach(() => cy.visit('/'));

    it('should redirect to login', () => {
      const loginPage = new LoginPage();

      cy.location('pathname').should('eq', '/login');

      cy.fixture('credentials').then(({ email, password }) => {
        loginPage.login(email, password);
      });

      cy.location('pathname').should('eq', '/tasks');
    });

    it('should not display menu options', () => {
      const header = new HeaderUI();
      header.profileMenu().should('not.exist');
    });
  });

  context('when already logged in', () => {
    beforeEach(() => {
      setUserAsAuthenticated();
      cy.visit('/');
    });

    it('should redirect to tasks page', () => {
      cy.location('pathname').should('eq', '/tasks');
    });

    it('should display menu options', () => {
      const header = new HeaderUI();
      header.profileMenu().should('exist').and('be.visible');
    });

    it('should be able to logout', () => {
      const header = new HeaderUI();

      header.profileMenuButton().click();
      header.logoutOption().click();
      cy.location('pathname').should('eq', '/login');
    });
  });
});
