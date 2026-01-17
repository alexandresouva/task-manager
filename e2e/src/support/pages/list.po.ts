import { TasksCounts } from '../models/list.model';

const PENDING_EMPTY_MESSAGE = 'Nice! No tasks pending.';
const COMPLETED_EMPTY_MESSAGE = 'No tasks completed yet!';

export class TaskListPage {
  // ===== Elements =====
  private taskItemEl() {
    return cy.getByTestId('task-item');
  }

  private taskCheckboxEl() {
    return cy.getByTestId('task-checkbox');
  }

  private taskDeleteEl() {
    return cy.getByTestId('delete-task-button');
  }

  private emptyTasksEl() {
    return cy.getByTestId('empty-tasks');
  }

  private createTaskInputEl() {
    return cy.getByTestId('create-task-input');
  }

  private createTaskButtonEl() {
    return cy.getByTestId('create-task-button');
  }

  // ===== Actions =====
  createTask(taskName: string) {
    this.createTaskInputEl().type(taskName);
    this.createTaskButtonEl().click();
  }

  toggleFirstPendingTask() {
    this.withinPendingTasks(() => {
      this.taskCheckboxEl().first().click();
    });
  }

  toggleFirstCompletedTask() {
    this.withinCompletedTasks(() => {
      this.taskCheckboxEl().first().click();
    });
  }

  deleteFirstPendingTask() {
    this.withinPendingTasks(() => {
      this.taskDeleteEl().first().click();
    });
  }

  deleteFirstCompletedTask() {
    this.withinCompletedTasks(() => {
      this.taskDeleteEl().first().click();
    });
  }

  // ===== Assertions =====
  assertTasksByStatus({ pending, completed }: TasksCounts) {
    this.withinPendingTasks(() => {
      this.taskItemEl().should('have.length', pending);
    });

    this.withinCompletedTasks(() => {
      this.taskItemEl().should('have.length', completed);
    });
  }

  assertPendingListIsNotEmpty() {
    this.withinPendingTasks(() => {
      this.emptyTasksEl().should('not.exist');
    });
  }

  assertCompletedListIsNotEmpty() {
    this.withinCompletedTasks(() => {
      this.emptyTasksEl().should('not.exist');
    });
  }

  assertPendingListIsEmpty() {
    this.withinPendingTasks(() => {
      this.assertEmptyStateVisible(PENDING_EMPTY_MESSAGE);
    });
  }

  assertCompletedListIsEmpty() {
    this.withinCompletedTasks(() => {
      this.assertEmptyStateVisible(COMPLETED_EMPTY_MESSAGE);
    });
  }

  // ===== Helpers =====
  private withinPendingTasks(fn: () => void) {
    cy.getByTestId('pending-tasks').within(fn);
  }

  private withinCompletedTasks(fn: () => void) {
    cy.getByTestId('completed-tasks').within(fn);
  }

  private assertEmptyStateVisible(message: string) {
    cy.getByTestId('empty-tasks')
      .should('be.visible')
      .and('contain.text', message);
  }
}
