export class LoginPage {
  private login(email: string, password: string) {
    cy.getByTestId('login-email').clear().type(email);
    cy.getByTestId('login-password').clear().type(password);
    cy.getByTestId('login-button').click();
  }

  loginWithValidCredentials() {
    cy.fixture('credentials').then(({ valid }) => {
      this.login(valid.email, valid.password);
    });
  }

  loginWithInvalidCredentials() {
    cy.fixture('credentials').then(({ invalid }) => {
      this.login(invalid.email, invalid.password);
    });
  }

  assertLoginErrorVisible() {
    cy.getByTestId('toast-list-item').should('be.visible');
    cy.getByTestId('toast-list-message').should(
      'contains.text',
      'Invalid email or password.',
    );
  }
}
