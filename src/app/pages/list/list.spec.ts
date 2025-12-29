import { Location } from '@angular/common';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Edit } from '@pages/edit/edit';
import { Task } from '@shared/models/task.model';
import { ToastConfig } from '@shared/models/toast-config.model';
import { TaskService } from '@shared/services/task-service';
import { ToastService } from '@shared/services/toast-service';
import { tasksMock } from '@testing/data/tasks.mock';
import { TestHelper } from '@testing/helpers/test-helper';
import { MockComponent, MockService } from 'ng-mocks';
import { of } from 'rxjs';

import { CreateTask } from './create-task/create-task';
import { List } from './list';
import { TaskList } from './task-list/task-list';

function setup(tasks: Task[] = []) {
  const taskServiceMock = MockService(TaskService) as jest.Mocked<TaskService>;
  const toastServiceMock = MockService(
    ToastService,
  ) as jest.Mocked<ToastService>;

  TestBed.configureTestingModule({
    imports: [List],
    providers: [
      { provide: TaskService, useValue: taskServiceMock },
      { provide: ToastService, useValue: toastServiceMock },
      provideRouter([
        { path: 'tasks/:id/edit', component: MockComponent(Edit) },
      ]),
    ],
  });

  taskServiceMock.getAll.mockReturnValue(of(tasks));

  const fixture = TestBed.createComponent(List);
  const component = fixture.componentInstance;
  const testHelper = new TestHelper(fixture);
  fixture.detectChanges();

  return { component, fixture, testHelper, taskServiceMock, toastServiceMock };
}

describe('List', () => {
  it('should create', () => {
    const { component } = setup();
    expect(component).toBeTruthy();
  });

  describe('when load tasks', () => {
    it('should filter completed tasks and pass them to the task list', () => {
      const { component, fixture, testHelper } = setup(tasksMock);
      const expectedCompletedTasks = tasksMock.filter((task) => task.completed);

      fixture.detectChanges();
      const completedTaskList =
        testHelper.getComponentInstanceByTestId<TaskList>('completed-tasks');

      expect(component['completedTasks']()).toEqual(expectedCompletedTasks);
      expect(completedTaskList.tasks()).toEqual(expectedCompletedTasks);
    });

    it('should filter pending tasks and pass them to the task list', () => {
      const { component, fixture, testHelper } = setup(tasksMock);
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
    it('should mark a pending task as completed', () => {
      const { component, fixture, testHelper, taskServiceMock } =
        setup(tasksMock);

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

    it('should mark a completed task as pending', () => {
      const { component, fixture, testHelper, taskServiceMock } =
        setup(tasksMock);

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
    it('should remove a pending task and update pending tasks list', () => {
      const { component, fixture, testHelper, taskServiceMock } =
        setup(tasksMock);

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

    it('should remove a completed task and update completed tasks list', () => {
      const { component, fixture, testHelper, taskServiceMock } =
        setup(tasksMock);

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

    it('should show success toast', () => {
      const { fixture, testHelper, taskServiceMock, toastServiceMock } =
        setup(tasksMock);
      const expectedToastConfig: ToastConfig = {
        type: 'success',
        title: 'Task has been deleted.',
      };
      const completedTaskList =
        testHelper.getComponentInstanceByTestId<TaskList>('completed-tasks');
      const taskToBeDeleted: Task = completedTaskList.tasks()[0];

      taskServiceMock.delete.mockReturnValue(of(null));
      completedTaskList['emitTaskDeleted'](taskToBeDeleted);
      fixture.detectChanges();

      expect(toastServiceMock.show).toHaveBeenCalledWith(expectedToastConfig);
    });
  });

  describe('when add a new task', () => {
    const fakeTask: Task = {
      id: 100,
      title: 'New Task',
      completed: false,
    };

    it('should add the new task to the pending tasks list', () => {
      const { component, fixture, testHelper, taskServiceMock } =
        setup(tasksMock);

      taskServiceMock.create.mockReturnValue(of(fakeTask));

      const createTaskForm =
        testHelper.getComponentInstanceByTestId<CreateTask>('create-task-form');
      createTaskForm.form.controls.title.setValue(fakeTask.title);
      createTaskForm['emitTaskCreated']();
      fixture.detectChanges();

      const pendingTasks = component['pendingTasks']();

      expect(taskServiceMock.create).toHaveBeenCalledWith(fakeTask.title);
      expect(pendingTasks).toContain(fakeTask);
    });

    it('should not add a new task to completed tasks list', () => {
      const { component, fixture, testHelper, taskServiceMock } =
        setup(tasksMock);

      taskServiceMock.create.mockReturnValue(of(fakeTask));

      const createTaskForm =
        testHelper.getComponentInstanceByTestId<CreateTask>('create-task-form');
      createTaskForm.form.controls.title.setValue(fakeTask.title);
      createTaskForm['emitTaskCreated']();
      fixture.detectChanges();

      const completedTasks = component['completedTasks']();

      expect(taskServiceMock.create).toHaveBeenCalledWith(fakeTask.title);
      expect(completedTasks).not.toContain(fakeTask);
    });

    it('should show success toast', () => {
      const { fixture, testHelper, taskServiceMock, toastServiceMock } =
        setup(tasksMock);
      const expectedToastConfig: ToastConfig = {
        type: 'success',
        title: 'Task has been added.',
      };

      taskServiceMock.create.mockReturnValue(of(fakeTask));

      const createTaskForm =
        testHelper.getComponentInstanceByTestId<CreateTask>('create-task-form');
      createTaskForm.form.controls.title.setValue(fakeTask.title);
      createTaskForm['emitTaskCreated']();
      fixture.detectChanges();

      expect(toastServiceMock.show).toHaveBeenCalledWith(expectedToastConfig);
    });
  });

  describe('when edit', () => {
    it('should redirect pending task to edit page', fakeAsync(() => {
      const { testHelper } = setup(tasksMock);
      const taskList =
        testHelper.getComponentInstanceByTestId<TaskList>('pending-tasks');
      const fakeEmittedTask: Task = taskList.tasks()[0];

      const location = TestBed.inject(Location);

      taskList['emitTaskEdited'](fakeEmittedTask);

      tick();

      expect(location.path()).toBe(`/tasks/${fakeEmittedTask.id}/edit`);
    }));
  });

  it('should redirect completed task to edit page', fakeAsync(() => {
    const { testHelper } = setup(tasksMock);
    const taskList =
      testHelper.getComponentInstanceByTestId<TaskList>('completed-tasks');
    const fakeEmittedTask: Task = taskList.tasks()[0];
    const location = TestBed.inject(Location);

    taskList['emitTaskEdited'](fakeEmittedTask);

    tick();

    expect(location.path()).toBe(`/tasks/${fakeEmittedTask.id}/edit`);
  }));
});
