describe('auth flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  context('when not logged in', () => {
    it('should redirect to login', () => {
      cy.location('pathname').should('eq', '/login');

      cy.fixture('credentials').then(({ email, password }) => {
        cy.get('[data-testid="login-email"]').clear().type(email);
        cy.get('[data-testid="login-password"]').clear().type(password);
        cy.get('[data-testid="login-button"]').click();
      });

      cy.location('pathname').should('eq', '/tasks');
    });
  });
});
