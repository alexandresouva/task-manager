import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingHarness } from '@angular/router/testing';

import { appConfig } from '@app/app.config';
import { tasksMock } from '@app/testing/data/tasks.mock';
import { setAuthToken } from '@app/testing/helpers/set-auth-token.helper';
import { TestHelper } from '@app/testing/test-helper/test-helper';
import { environment } from 'src/environments/environment';

async function setup() {
  setAuthToken();

  TestBed.configureTestingModule({
    providers: [appConfig.providers, provideHttpClientTesting()],
  });

  const harness = await RouterTestingHarness.create('');
  const testHelper = new TestHelper(harness.fixture);
  const httpTestingController = TestBed.inject(HttpTestingController);

  return { harness, testHelper, httpTestingController };
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

  describe('when a new task is added', () => {
    it('should display the new task in the pending list', async () => {
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
      await harness.fixture.whenStable();

      const { pendingTasks } = getTasks(testHelper);
      expect(pendingTasks.length).toBe(1);
    });
  });
});
