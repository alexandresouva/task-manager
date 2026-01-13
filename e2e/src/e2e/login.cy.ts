describe('auth flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  context('when not logged in', () => {
    it('should redirect to login', () => {
      cy.location('pathname').should('eq', '/login');

      cy.get('[data-testid="login-email"]').clear().type('fake@email.com');
      cy.get('[data-testid="login-password"]').clear().type('fakePassword');
      cy.get('[data-testid="login-button"]').click();

      cy.location('pathname').should('eq', '/tasks');
    });
  });
});
