describe('auth flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  context('when not logged in', () => {
    it('should redirect to login', () => {
      cy.location('pathname').should('eq', '/login');

      cy.fixture('credentials').then(({ email, password }) => {
        cy.getByTestId('login-email').clear().type(email);
        cy.getByTestId('login-password').clear().type(password);
        cy.getByTestId('login-button').click();
      });

      cy.location('pathname').should('eq', '/tasks');
    });
  });
});
