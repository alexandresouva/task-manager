import { TasksCounts } from '../models/list.model';

const PENDING_EMPTY_MESSAGE = 'Nice! No tasks pending.';
const COMPLETED_EMPTY_MESSAGE = 'No tasks completed yet!';

export class TaskListPage {
  assertTasksByStatus({ pending, completed }: TasksCounts) {
    this.withinPendingTasks(() => {
      this.assertTaskCount(pending);
    });

    this.withinCompletedTasks(() => {
      this.assertTaskCount(completed);
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

  assertPendingListIsNotEmpty() {
    this.withinPendingTasks(() => {
      this.assertEmptyStateNotVisible();
    });
  }

  assertCompletedListIsNotEmpty() {
    this.withinCompletedTasks(() => {
      this.assertEmptyStateNotVisible();
    });
  }

  // ===== Scopes =====

  private withinPendingTasks(fn: () => void) {
    cy.getByTestId('pending-tasks').within(fn);
  }

  private withinCompletedTasks(fn: () => void) {
    cy.getByTestId('completed-tasks').within(fn);
  }

  // ===== Assertions =====

  private assertTaskCount(expected: number) {
    cy.getByTestId('task-item').should('have.length', expected);
  }

  private assertEmptyStateVisible(message: string) {
    cy.getByTestId('empty-tasks')
      .should('be.visible')
      .and('contain.text', message);
  }

  private assertEmptyStateNotVisible() {
    cy.getByTestId('empty-tasks').should('not.exist');
  }
}
