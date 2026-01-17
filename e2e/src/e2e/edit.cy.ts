import {
  assertOnEditPage,
  assertOnTasksPage,
} from '../support/helpers/pages.helper';
import {
  mockTask,
  mockUpdateTask,
} from '../support/interceptors/tasks.interceptors';
import { EditTaskPage } from '../support/pages/edit.po';
import { TaskListPage } from '../support/pages/list.po';
import { listSetup } from './list.cy';

function editPendingTaskSetup() {
  cy.fixture('pending-task').then((task) => {
    const getTaskRequest = mockTask(task);

    new TaskListPage().editFirstPendingTask();
    cy.wait(`@${getTaskRequest}`);

    assertOnEditPage(task.id);
  });
}

function editCompletedTaskSetup() {
  cy.fixture('completed-task').then((task) => {
    const getTaskRequest = mockTask(task);

    new TaskListPage().editFirstCompletedTask();
    cy.wait(`@${getTaskRequest}`);

    assertOnEditPage(task.id);
  });
}

describe('edit task', () => {
  let editPage = new EditTaskPage();

  beforeEach(() => {
    listSetup({ pending: 1, completed: 1 });

    editPage = new EditTaskPage();
  });

  context('when editing a pending task', () => {
    beforeEach(() => editPendingTaskSetup());

    it('should update the title and return to the task list', () => {
      const editRequest = mockUpdateTask();

      editPage.typeTitle('Updated title');
      editPage.saveTask();

      cy.wait(`@${editRequest}`);

      assertOnTasksPage();
    });

    it('should update the states and return to the task list', () => {
      const editRequest = mockUpdateTask();

      editPage.toggleCompleted();
      editPage.saveTask();

      cy.wait(`@${editRequest}`);

      assertOnTasksPage();
    });
  });

  context('when editing a completed task', () => {
    beforeEach(() => editCompletedTaskSetup());

    it('should update the title and return to the task list', () => {
      const editRequest = mockUpdateTask();

      editPage.typeTitle('Updated title');
      editPage.saveTask();

      cy.wait(`@${editRequest}`);

      assertOnTasksPage();
    });

    it('should update the states and return to the task list', () => {
      const editRequest = mockUpdateTask();

      editPage.toggleCompleted();
      editPage.saveTask();

      cy.wait(`@${editRequest}`);

      assertOnTasksPage();
    });
  });
});
