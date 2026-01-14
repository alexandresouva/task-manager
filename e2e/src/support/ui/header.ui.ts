export class HeaderUI {
  profileMenu() {
    return cy.getByTestId('profile-menu-dropdown');
  }

  profileMenuButton() {
    return cy.getByTestId('profile-menu-button');
  }

  logoutOption() {
    return cy.getByTestId('logout-option');
  }
}
