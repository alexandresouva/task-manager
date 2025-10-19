import { TestBed } from '@angular/core/testing';

import { TaskService } from '@app/shared/services/task-service';
import { Task } from '@shared/models/tasks.model';
import { tasksMock } from '@testing/data/tasks.mock';
import { TestHelper } from '@testing/helpers/test-helper';
import { createTaskServiceMock } from '@testing/mocks/tasks-service.mock';
import { of } from 'rxjs';

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

  describe('after load tasks', () => {
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

  describe('when toggle a task status', () => {
    it('should mark a pending task as completed', async () => {
      const { component, fixture, testHelper, taskServiceMock } =
        await setup(tasksMock);

      const pendingTaskList =
        testHelper.getComponentInstanceByTestId<TaskList>('pending-tasks');
      const fakeEmittedTask: Task = pendingTaskList.tasks()[0];
      const expectedUpdatedTask = { ...fakeEmittedTask, completed: true };

      taskServiceMock.update.mockReturnValue(of(expectedUpdatedTask));
      pendingTaskList['emitTaskToggled'](fakeEmittedTask);
      fixture.detectChanges();

      expect(taskServiceMock.update).toHaveBeenCalledWith(
        fakeEmittedTask.id,
        expectedUpdatedTask,
      );

      const pendingTasksAfterToggle = component['pendingTasks']();
      expect(pendingTasksAfterToggle).not.toContain(fakeEmittedTask);
      expect(component['completedTasks']()).toContain(expectedUpdatedTask);
    });

    it('should mark a completed task as pending', async () => {
      const { component, fixture, testHelper, taskServiceMock } =
        await setup(tasksMock);

      const completedTaskList =
        testHelper.getComponentInstanceByTestId<TaskList>('completed-tasks');
      const fakeEmittedTask: Task = completedTaskList.tasks()[0];
      const expectedUpdatedTask = { ...fakeEmittedTask, completed: false };

      taskServiceMock.update.mockReturnValue(of(expectedUpdatedTask));
      completedTaskList['emitTaskToggled'](fakeEmittedTask);
      fixture.detectChanges();

      expect(taskServiceMock.update).toHaveBeenCalledWith(
        fakeEmittedTask.id,
        expectedUpdatedTask,
      );

      const completedTasksAfterToggle = component['completedTasks']();
      expect(completedTasksAfterToggle).not.toContain(fakeEmittedTask);
      expect(component['pendingTasks']()).toContain(expectedUpdatedTask);
    });
  });

  describe('when delete a task', () => {
    it('should remove a pending task and update pending tasks list', async () => {
      const { component, fixture, testHelper, taskServiceMock } =
        await setup(tasksMock);

      const pendingTaskList =
        testHelper.getComponentInstanceByTestId<TaskList>('pending-tasks');
      const fakeEmittedTask: Task = pendingTaskList.tasks()[0];

      taskServiceMock.delete.mockReturnValue(of(null));
      pendingTaskList['emitTaskDeleted'](fakeEmittedTask);
      fixture.detectChanges();

      expect(taskServiceMock.delete).toHaveBeenCalledWith(fakeEmittedTask.id);

      const pendingTasksAfterDelete = component['pendingTasks']();
      const completedTasksAfterDelete = component['completedTasks']();
      expect(pendingTasksAfterDelete).not.toContain(fakeEmittedTask);
      expect(completedTasksAfterDelete).not.toContain(fakeEmittedTask);
    });

    it('should remove a completed task and update completed tasks list', async () => {
      const { component, fixture, testHelper, taskServiceMock } =
        await setup(tasksMock);

      const completedTaskList =
        testHelper.getComponentInstanceByTestId<TaskList>('completed-tasks');
      const fakeEmittedTask: Task = completedTaskList.tasks()[0];

      taskServiceMock.delete.mockReturnValue(of(null));
      completedTaskList['emitTaskDeleted'](fakeEmittedTask);
      fixture.detectChanges();

      expect(taskServiceMock.delete).toHaveBeenCalledWith(fakeEmittedTask.id);

      const pendingTasksAfterDelete = component['pendingTasks']();
      const completedTasksAfterDelete = component['completedTasks']();
      expect(pendingTasksAfterDelete).not.toContain(fakeEmittedTask);
      expect(completedTasksAfterDelete).not.toContain(fakeEmittedTask);
    });
  });
});
