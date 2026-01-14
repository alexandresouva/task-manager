export class LoginPage {
  fillCredentials(email: string, password: string) {
    cy.getByTestId('login-email').clear().type(email);
    cy.getByTestId('login-password').clear().type(password);
  }

  submit() {
    cy.getByTestId('login-button').click();
  }

  login(email: string, password: string) {
    this.fillCredentials(email, password);
    this.submit();
  }
}
