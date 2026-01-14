export function setUserAsAuthenticated() {
  cy.window().then((win) => {
    win.localStorage.setItem('auth_token', 'fake-jwt-token');
  });
}
