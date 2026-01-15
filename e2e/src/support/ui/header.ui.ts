export class HeaderUI {
  private profileMenu() {
    return cy.getByTestId('profile-menu-dropdown');
  }

  private profileMenuButton() {
    return cy.getByTestId('profile-menu-button');
  }

  private logoutOption() {
    return cy.getByTestId('logout-option');
  }

  logout() {
    this.profileMenuButton().click();
    this.logoutOption().click();
  }

  assertProfileMenuVisible() {
    this.profileMenu().should('be.visible');
  }

  assertProfileMenuNotVisible() {
    this.profileMenu().should('not.exist');
  }
}
