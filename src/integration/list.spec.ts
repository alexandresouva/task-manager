import { Location } from '@angular/common';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingHarness } from '@angular/router/testing';

import { ListFacade } from '@features/list/list-facade';
import { ListStore } from '@features/list/list-store';
import { Task } from '@shared/models/task.model';
import { tasksMock } from '@testing/data/tasks.mock';
import { setAuthToken } from '@testing/helpers/set-auth-token.helper';
import { TestHelper } from '@testing/test-helper/test-helper';
import { appConfig } from 'src/app/app.config';
import { environment } from 'src/environments/environment';

async function setup() {
  setAuthToken();

  TestBed.configureTestingModule({
    providers: [
      appConfig.providers,
      provideHttpClientTesting(),
      ListFacade,
      ListStore,
    ],
  });

  const harness = await RouterTestingHarness.create('');
  const testHelper = new TestHelper(harness.fixture);
  const httpTestingController = TestBed.inject(HttpTestingController);
  const location = TestBed.inject(Location);

  return { harness, testHelper, httpTestingController, location };
}

function getTasks(testHelper: TestHelper<unknown>) {
  const pendingTasks = testHelper.queries.queryAll(
    'task-item',
    testHelper.queries.query('pending-tasks'),
  );
  const completedTasks = testHelper.queries.queryAll(
    'task-item',
    testHelper.queries.query('completed-tasks'),
  );

  return { pendingTasks, completedTasks };
}

function getEmptyStateForTasksLists(testHelper: TestHelper<unknown>) {
  const pendingHost = testHelper.queries.query('pending-tasks');
  const completedHost = testHelper.queries.query('completed-tasks');

  const pendingEmptyState = testHelper.queries.query(
    'empty-tasks',
    pendingHost,
  );

  const completedEmptyState = testHelper.queries.query(
    'empty-tasks',
    completedHost,
  );

  return { pendingEmptyState, completedEmptyState };
}

describe('List', () => {
  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
    localStorage.clear();
  });

  describe('when there are no tasks', () => {
    it('should display empty state for both pending and completed lists', async () => {
      const { harness, testHelper, httpTestingController } = await setup();

      const req = httpTestingController.expectOne({
        url: environment.endpoints.tasks,
        method: 'GET',
      });
      req.flush([]);

      harness.detectChanges();

      const { pendingTasks, completedTasks } = getTasks(testHelper);
      const { pendingEmptyState, completedEmptyState } =
        getEmptyStateForTasksLists(testHelper);

      expect(pendingEmptyState).toBeTruthy();
      expect(completedEmptyState).toBeTruthy();
      expect(pendingTasks.length).toBe(0);
      expect(completedTasks.length).toBe(0);
    });
  });

  describe('when there are two completed tasks and one pending', () => {
    it('should display both pending and completed tasks correctly', async () => {
      const { harness, testHelper, httpTestingController } = await setup();

      const req = httpTestingController.expectOne({
        url: environment.endpoints.tasks,
        method: 'GET',
      });
      req.flush(tasksMock.slice(0, 3));

      harness.detectChanges();

      const { pendingTasks, completedTasks } = getTasks(testHelper);
      const { pendingEmptyState, completedEmptyState } =
        getEmptyStateForTasksLists(testHelper);

      expect(pendingEmptyState).toBeFalsy();
      expect(completedEmptyState).toBeFalsy();
      expect(pendingTasks.length).toBe(1);
      expect(completedTasks.length).toBe(2);
    });
  });

  describe('when adding a new task', () => {
    it('should display the new task in the pending list', fakeAsync(async () => {
      const { harness, testHelper, httpTestingController } = await setup();

      const listReq = httpTestingController.expectOne({
        url: environment.endpoints.tasks,
        method: 'GET',
      });
      listReq.flush([]);

      harness.detectChanges();

      testHelper.trigger.input('create-task-input', 'New Task');
      testHelper.dispatch.click('create-task-button');

      harness.detectChanges();

      const createReq = httpTestingController.expectOne({
        url: environment.endpoints.tasks,
        method: 'POST',
      });
      createReq.flush(tasksMock.slice(0, 1));

      harness.detectChanges();
      tick();

      const { pendingTasks } = getTasks(testHelper);
      expect(pendingTasks.length).toBe(1);
    }));
  });

  describe('when editing a task', () => {
    const initialTask: Task = tasksMock[0];
    const updatedTask: Task = {
      ...initialTask,
      title: 'Updated Task',
      completed: false,
    };

    it('should navigate to edit page, update the task, and return to the list', fakeAsync(async () => {
      const { harness, testHelper, httpTestingController, location } =
        await setup();

      const listReq = httpTestingController.expectOne({
        url: environment.endpoints.tasks,
        method: 'GET',
      });
      listReq.flush([initialTask]);

      harness.detectChanges();

      let { pendingTasks, completedTasks } = getTasks(testHelper);
      expect(pendingTasks.length).toBe(0);
      expect(completedTasks.length).toBe(1);

      testHelper.dispatch.click('edit-task-button', completedTasks[0]);

      tick();

      const editReq = httpTestingController.expectOne({
        url: `${environment.endpoints.tasks}/${initialTask.id}`,
        method: 'GET',
      });
      editReq.flush(updatedTask);

      tick(500);

      expect(location.path()).toBe(`/tasks/${initialTask.id}/edit`);

      harness.detectChanges();

      testHelper.trigger.input('task-title-input', updatedTask.title);
      testHelper.trigger.checkboxChange('task-completed-checkbox', false);
      testHelper.dispatch.click('submit-task-button');

      const updateReq = httpTestingController.expectOne({
        url: `${environment.endpoints.tasks}/${initialTask.id}`,
        method: 'PUT',
      });
      updateReq.flush(updatedTask);

      tick();
      harness.detectChanges();

      const updatedListReq = httpTestingController.expectOne({
        url: environment.endpoints.tasks,
        method: 'GET',
      });
      updatedListReq.flush([updatedTask]);

      harness.detectChanges();

      ({ pendingTasks, completedTasks } = getTasks(testHelper));

      expect(location.path()).toBe('/tasks');
      expect(pendingTasks.length).toBe(1);
      expect(completedTasks.length).toBe(0);
    }));
  });

  describe('when removing a task', () => {
    it('should remove the task from the list', async () => {
      const { harness, testHelper, httpTestingController } = await setup();
      const taskToRemove = tasksMock[0];

      const req = httpTestingController.expectOne({
        url: environment.endpoints.tasks,
        method: 'GET',
      });
      req.flush([taskToRemove]);

      harness.detectChanges();

      let { pendingTasks, completedTasks } = getTasks(testHelper);

      expect(pendingTasks.length).toBe(0);
      expect(completedTasks.length).toBe(1);

      testHelper.dispatch.click('delete-task-button', completedTasks[0]);

      harness.detectChanges();

      const deleteReq = httpTestingController.expectOne({
        url: `${environment.endpoints.tasks}/${taskToRemove.id}`,
        method: 'DELETE',
      });
      deleteReq.flush(null);

      harness.detectChanges();

      ({ pendingTasks, completedTasks } = getTasks(testHelper));

      expect(pendingTasks.length).toBe(0);
      expect(completedTasks.length).toBe(0);
    });
  });
});
