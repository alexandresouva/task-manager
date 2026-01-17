export function assertOnLoginPage() {
  cy.location('pathname').should('eq', '/login');
}

export function assertOnTasksPage() {
  cy.location('pathname').should('eq', '/tasks');
}

export function assertOnEditPage(taskId: number) {
  cy.location('pathname').should('eq', `/tasks/${taskId}/edit`);
}
