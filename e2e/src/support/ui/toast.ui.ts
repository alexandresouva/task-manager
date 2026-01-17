export class ToastUI {
  private toastItem() {
    return cy.getByTestId('toast-list-item');
  }

  private toastMessage() {
    return cy.getByTestId('toast-list-title');
  }

  assertToastVisible(message: string) {
    this.toastItem().should('be.visible');
    this.toastMessage().should('contain.text', message);
  }

  assertToastNotVisible() {
    this.toastItem().should('not.exist');
    this.toastMessage().should('not.exist');
  }
}
