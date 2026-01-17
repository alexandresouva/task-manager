export class EditTaskPage {
  typeTitle(title: string) {
    cy.getByTestId('task-title-input').clear().type(title);
  }

  toggleCompleted() {
    cy.getByTestId('task-completed-checkbox').click();
  }

  saveTask() {
    cy.getByTestId('submit-task-button').click();
  }
}
