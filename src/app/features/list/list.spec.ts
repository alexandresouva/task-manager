import { Location } from '@angular/common';
import { signal } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Edit } from '@features/edit/edit';
import { Task } from '@shared/models/task.model';
import { completedTasksMock, pendingTasksMock } from '@testing/data/tasks.mock';
import { TestHelper } from '@testing/test-helper/test-helper';
import { MockComponent, MockProvider } from 'ng-mocks';

import { CreateTask } from './create-task/create-task';
import { List } from './list';
import { ListFacade } from './list-facade';
import { TaskList } from './task-list/task-list';

type SetupParams = {
  pendingTasks: Task[];
  completedTasks: Task[];
};

function setup({
  pendingTasks = [],
  completedTasks = [],
}: Partial<SetupParams> = {}) {
  TestBed.configureTestingModule({
    imports: [List],
    providers: [
      MockProvider(ListFacade, {
        pendingTasks: signal(pendingTasks),
        completedTasks: signal(completedTasks),
        loadTasks: jest.fn(),
        createTask: jest.fn(),
        toggleTask: jest.fn(),
        deleteTask: jest.fn(),
      }),
      provideRouter([
        { path: 'tasks/:id/edit', component: MockComponent(Edit) },
      ]),
    ],
  });

  const fixture = TestBed.createComponent(List);
  const component = fixture.componentInstance;
  const testHelper = new TestHelper(fixture);
  const listFacadeMock = TestBed.inject(ListFacade);
  fixture.detectChanges();

  return { component, fixture, testHelper, listFacadeMock };
}

describe('List', () => {
  it('should create', () => {
    const { component } = setup();
    expect(component).toBeTruthy();
  });

  describe('when load tasks', () => {
    it('should pass completed tasks to the completed task list', () => {
      const { fixture, testHelper } = setup({
        completedTasks: completedTasksMock,
      });

      fixture.detectChanges();

      const completedTaskList =
        testHelper.queries.getComponentInstance<TaskList>('completed-tasks');

      expect(completedTaskList.tasks()).toEqual(completedTasksMock);
    });

    it('should pass pending tasks to the pending task list', () => {
      const { fixture, testHelper } = setup({
        pendingTasks: pendingTasksMock,
      });

      fixture.detectChanges();

      const pendingTaskList =
        testHelper.queries.getComponentInstance<TaskList>('pending-tasks');

      expect(pendingTaskList.tasks()).toEqual(pendingTasksMock);
    });
  });

  describe('when create a task', () => {
    it('should delegate creation to the facade', () => {
      const { listFacadeMock, testHelper, fixture } = setup();
      const fakeTitle = 'Test Task';

      const createTaskForm =
        testHelper.queries.getComponentInstance<CreateTask>('create-task-form');
      createTaskForm.created.emit(fakeTitle);

      fixture.detectChanges();

      expect(listFacadeMock.createTask).toHaveBeenCalledWith(fakeTitle);
    });
  });

  describe('when toggle a task', () => {
    it('should delegate task toggle to the facade for a pending task', () => {
      const { testHelper, fixture, listFacadeMock } = setup();
      const fakeTask: Task = pendingTasksMock[0];

      const pendingTaskList =
        testHelper.queries.getComponentInstance<TaskList>('pending-tasks');
      pendingTaskList.toggled.emit(fakeTask);

      fixture.detectChanges();

      expect(listFacadeMock.toggleTask).toHaveBeenCalledWith(fakeTask);
    });

    it('should delegate task toggle to the facade for a completed task', () => {
      const { testHelper, listFacadeMock } = setup();
      const fakeTask: Task = completedTasksMock[0];

      const completedTaskList =
        testHelper.queries.getComponentInstance<TaskList>('completed-tasks');
      completedTaskList.toggled.emit(fakeTask);

      expect(listFacadeMock.toggleTask).toHaveBeenCalledWith(fakeTask);
    });
  });

  describe('when delete a task', () => {
    it('should delegate delete to the facade for a pending task', () => {
      const { testHelper, listFacadeMock } = setup();
      const fakeTask: Task = pendingTasksMock[0];

      const pendingTaskList =
        testHelper.queries.getComponentInstance<TaskList>('pending-tasks');
      pendingTaskList.deleted.emit(fakeTask);

      expect(listFacadeMock.deleteTask).toHaveBeenCalledWith(fakeTask);
    });

    it('should delegate delete to the facade for a completed task', () => {
      const { testHelper, listFacadeMock } = setup();
      const fakeTask: Task = completedTasksMock[0];

      const completedTaskList =
        testHelper.queries.getComponentInstance<TaskList>('completed-tasks');
      completedTaskList.deleted.emit(fakeTask);

      expect(listFacadeMock.deleteTask).toHaveBeenCalledWith(fakeTask);
    });
  });

  describe('when edit a task', () => {
    it('should navigate to edit page for a pending task', fakeAsync(() => {
      const { testHelper, fixture } = setup();
      const location = TestBed.inject(Location);
      const fakeTask: Task = pendingTasksMock[0];

      const taskList =
        testHelper.queries.getComponentInstance<TaskList>('pending-tasks');
      taskList.edited.emit(fakeTask);

      fixture.detectChanges();
      tick();

      expect(location.path()).toBe(`/tasks/${fakeTask.id}/edit`);
    }));

    it('should navigate to edit page (completed task)', fakeAsync(() => {
      const { testHelper, fixture } = setup();
      const location = TestBed.inject(Location);
      const fakeTask: Task = completedTasksMock[0];

      const taskList =
        testHelper.queries.getComponentInstance<TaskList>('completed-tasks');
      taskList.edited.emit(fakeTask);

      fixture.detectChanges();
      tick();

      expect(location.path()).toBe(`/tasks/${fakeTask.id}/edit`);
    }));
  });
});
