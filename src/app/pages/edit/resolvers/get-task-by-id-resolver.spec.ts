import { Component, input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  provideRouter,
  ResolveFn,
  withComponentInputBinding,
} from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { Task } from '@shared/models/task.model';
import { TaskService } from '@shared/services/task-service';
import { MockService } from 'ng-mocks';
import { of } from 'rxjs';

import { getTaskByIdResolver } from './get-task-by-id-resolver';

@Component({
  selector: 'app-test',
  template: '',
})
class FakeComponent {
  readonly task = input<Task>();
}

function setup() {
  const taskServiceMock = MockService(TaskService) as jest.Mocked<TaskService>;

  TestBed.configureTestingModule({
    providers: [
      { provide: TaskService, useValue: taskServiceMock },
      provideRouter(
        [
          {
            path: 'test/:id',
            resolve: { task: getTaskByIdResolver },
            component: FakeComponent,
          },
        ],
        withComponentInputBinding(),
      ),
    ],
  });

  return { taskServiceMock };
}
describe('getTaskByIdResolver', () => {
  const executeResolver: ResolveFn<Task> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() =>
      getTaskByIdResolver(...resolverParameters),
    );

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });

  it('should return a task by id', async () => {
    const { taskServiceMock } = setup();
    const fakeTask: Task = { id: 1, title: 'Item 1', completed: false };

    taskServiceMock.getById.mockReturnValue(of(fakeTask));

    const harness = await RouterTestingHarness.create(`test/${fakeTask.id}`);
    const fakeComponentDebugEl = harness.fixture.debugElement.query(
      By.directive(FakeComponent),
    );

    expect(taskServiceMock.getById).toHaveBeenCalledWith(fakeTask.id);
    expect(fakeComponentDebugEl.componentInstance.task()).toBe(fakeTask);
  });
});
