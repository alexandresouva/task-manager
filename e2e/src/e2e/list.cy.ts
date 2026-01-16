import { setUserAsAuthenticated } from '../support/helpers/auth.helper';
import { mockTasksWithCounts } from '../support/interceptors/tasks.interceptors';
import { TaskListPage } from '../support/pages/list.po';

describe('list', () => {
  let listPage: TaskListPage;

  beforeEach(() => {
    listPage = new TaskListPage();
    setUserAsAuthenticated();
  });

  context('when there are no tasks', () => {
    beforeEach(() => {
      const tasksRequest = mockTasksWithCounts({
        pending: 0,
        completed: 0,
      });

      cy.visit('/');
      cy.wait(`@${tasksRequest}`);
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
      const tasksRequest = mockTasksWithCounts({
        pending: 3,
        completed: 2,
      });

      cy.visit('/');
      cy.wait(`@${tasksRequest}`);
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
});
