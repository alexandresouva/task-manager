import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { Task } from '@shared/models/tasks.model';
import { TaskService } from '@app/shared/services/task-service';
import { createTaskServiceMock } from '@testing/mocks/tasks-service.mock';
import { tasksMock } from '@testing/data/tasks.mock';
import { TestHelper } from '@testing/helpers/test-helper';
import { List } from './list';
import { TaskList } from './task-list/task-list';

async function setup(tasks: Task[] = []) {
  const taskServiceMock = createTaskServiceMock();

  TestBed.configureTestingModule({
    imports: [List],
    providers: [{ provide: TaskService, useValue: taskServiceMock }],
  });
  await TestBed.compileComponents();

  taskServiceMock.getAll.mockReturnValue(of(tasks));

  const fixture = TestBed.createComponent(List);
  const component = fixture.componentInstance;
  const testHelper = new TestHelper(fixture);
  fixture.detectChanges();

  return { component, fixture, testHelper, taskServiceMock };
}

describe('List', () => {
  it('should create', async () => {
    const { component } = await setup();
    expect(component).toBeTruthy();
  });

  it('should filter completed tasks and pass them to the task list', async () => {
    const { component, fixture, testHelper } = await setup(tasksMock);
    const expectedCompletedTasks = tasksMock.filter((task) => task.completed);

    fixture.detectChanges();
    const completedTaskList =
      testHelper.getComponentInstanceByTestId<TaskList>('completed-tasks');

    expect(component['completedTasks']()).toEqual(expectedCompletedTasks);
    expect(completedTaskList.tasks()).toEqual(expectedCompletedTasks);
  });

  it('should filter pending tasks and pass them to the task list', async () => {
    const { component, fixture, testHelper } = await setup(tasksMock);
    const expectedPendingTasks = tasksMock.filter((task) => !task.completed);

    fixture.detectChanges();
    const pendingTaskList =
      testHelper.getComponentInstanceByTestId<TaskList>('pending-tasks');

    expect(component['pendingTasks']()).toEqual(
      tasksMock.filter((task) => !task.completed),
    );
    expect(pendingTaskList.tasks()).toEqual(expectedPendingTasks);
  });
});
