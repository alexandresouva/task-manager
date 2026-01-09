import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingHarness } from '@angular/router/testing';

import { appConfig } from '@app/app.config';
import { tasksMock } from '@app/testing/data/tasks.mock';
import { setAuthToken } from '@app/testing/helpers/set-auth-token.helper';
import { TestHelper } from '@app/testing/helpers/test-helper';
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
  const pendingTasks = testHelper.queryAllByTestIdWithin(
    'pending-tasks',
    'task-item',
  );
  const completedTasks = testHelper.queryAllByTestIdWithin(
    'completed-tasks',
    'task-item',
  );

  return { pendingTasks, completedTasks };
}

function getEmptyStateForTasksLists(testHelper: TestHelper<unknown>) {
  const pendingEmptyState = testHelper.queryByTestIdWithin(
    'pending-tasks',
    'empty-tasks',
  );
  const completedEmptyState = testHelper.queryByTestIdWithin(
    'completed-tasks',
    'empty-tasks',
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
});
