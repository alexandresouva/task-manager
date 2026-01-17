import { setUserAsAuthenticated } from '../support/helpers/auth.helper';
import {
  mockTasksWithCounts,
  mockToggleTask,
} from '../support/interceptors/tasks.interceptors';
import { TasksCounts } from '../support/models/list.model';
import { TaskListPage } from '../support/pages/list.po';

function setup(tasks: TasksCounts) {
  const tasksRequest = mockTasksWithCounts(tasks);

  cy.visit('/');
  cy.wait(`@${tasksRequest}`);
}

describe('list', () => {
  let listPage: TaskListPage;

  beforeEach(() => {
    listPage = new TaskListPage();
    setUserAsAuthenticated();
  });

  context('when there are no tasks', () => {
    beforeEach(() => {
      setup({
        pending: 0,
        completed: 0,
      });
    });

    it('should indicate that the pending tasks list is empty', () => {
      listPage.assertPendingListIsEmpty();
    });

    it('should indicate that the completed tasks list is empty', () => {
      listPage.assertCompletedListIsEmpty();
    });
  });

  context('when there are 3 pending and 2 completed tasks', () => {
    beforeEach(() => {
      setup({
        pending: 3,
        completed: 2,
      });
    });

    it('should not show an empty state in the pending tasks list', () => {
      listPage.assertPendingListIsNotEmpty();
    });

    it('should not show an empty state in the completed tasks list', () => {
      listPage.assertCompletedListIsNotEmpty();
    });

    it('should show the correct task count for each status', () => {
      listPage.assertTasksByStatus({ pending: 3, completed: 2 });
    });
  });

  context('when a task is toggled', () => {
    beforeEach(() => {
      setup({
        pending: 2,
        completed: 2,
      });
    });

    it('should move a task from completed back to pending when it is unmarked', () => {
      const toggleRequest = mockToggleTask();

      listPage.toggleFirstCompletedTask();

      cy.wait(`@${toggleRequest}`);

      listPage.assertTasksByStatus({
        pending: 3,
        completed: 1,
      });
    });

    it('should move a task from pending to completed when it is marked', () => {
      const toggleRequest = mockToggleTask();

      listPage.toggleFirstPendingTask();

      cy.wait(`@${toggleRequest}`);

      listPage.assertTasksByStatus({
        pending: 1,
        completed: 3,
      });
    });
  });
});
