import { TestBed } from '@angular/core/testing';

import { Task } from '@shared/models/task.model';
import { TaskService } from '@shared/services/task-service';
import { ToastService } from '@shared/services/toast-service';
import { tasksMock } from '@testing/data/tasks.mock';
import { MockProvider, MockService } from 'ng-mocks';
import { of, throwError } from 'rxjs';

import { ListFacade } from './list-facade';
import { ListStore } from './list-store';

function setup() {
  const taskServiceMock = MockService(TaskService) as jest.Mocked<TaskService>;
  const toastServiceMock = MockService(
    ToastService,
  ) as jest.Mocked<ToastService>;

  TestBed.configureTestingModule({
    providers: [
      ListFacade,
      { provide: TaskService, useValue: taskServiceMock },
      { provide: ToastService, useValue: toastServiceMock },
      MockProvider(ListStore, {
        setTasks: jest.fn(),
        addTask: jest.fn(),
        updateTask: jest.fn(),
        removeTask: jest.fn(),
      }),
    ],
  });

  const facade = TestBed.inject(ListFacade);
  const listStoreMock = TestBed.inject(ListStore);

  return { facade, taskServiceMock, listStoreMock, toastServiceMock };
}

describe('ListFacade', () => {
  const fakeTask: Task = {
    id: 1,
    title: 'Fake Task',
    completed: false,
  };

  it('should be created', () => {
    const { facade } = setup();
    expect(facade).toBeTruthy();
  });

  describe('when loadTasks is called', () => {
    it('should orchestrate load tasks flow in success', () => {
      const { facade, taskServiceMock, listStoreMock } = setup();

      taskServiceMock.getAll.mockReturnValue(of(tasksMock));
      facade.loadTasks();

      expect(taskServiceMock.getAll).toHaveBeenCalled();
      expect(listStoreMock.setTasks).toHaveBeenCalledWith(tasksMock);
    });

    it('should display error in error', () => {
      const { facade, taskServiceMock, listStoreMock, toastServiceMock } =
        setup();

      taskServiceMock.getAll.mockReturnValue(
        throwError(() => new Error('fake error')),
      );
      facade.loadTasks();

      expect(taskServiceMock.getAll).toHaveBeenCalled();
      expect(listStoreMock.setTasks).not.toHaveBeenCalled();
      expect(toastServiceMock.show).toHaveBeenCalledWith({
        type: 'error',
        title: 'Could not load tasks.',
        message: 'Please try again later.',
      });
    });
  });

  describe('when createTask is called', () => {
    it('should create task, update store and show success toast', () => {
      const { facade, taskServiceMock, listStoreMock, toastServiceMock } =
        setup();

      taskServiceMock.create.mockReturnValue(of(fakeTask));

      facade.createTask('New task');

      expect(taskServiceMock.create).toHaveBeenCalledWith('New task');
      expect(listStoreMock.addTask).toHaveBeenCalledWith(fakeTask);
      expect(toastServiceMock.show).toHaveBeenCalledWith({
        type: 'success',
        title: 'Task has been added.',
      });
    });
  });

  describe('when toggleTask is called', () => {
    it('should toggle a pending task to completed', () => {
      const { facade, taskServiceMock, listStoreMock } = setup();

      const fakePendingTask = {
        ...fakeTask,
        completed: false,
      };
      const updatedTask: Task = {
        ...fakePendingTask,
        completed: true,
      };

      taskServiceMock.update.mockReturnValue(of(updatedTask));

      facade.toggleTask(fakePendingTask);

      expect(taskServiceMock.update).toHaveBeenCalledWith(
        fakePendingTask.id,
        updatedTask,
      );
      expect(listStoreMock.updateTask).toHaveBeenCalledWith(updatedTask);
    });

    it('should toggle a completed task to pending', () => {
      const { facade, taskServiceMock, listStoreMock } = setup();

      const fakeCompletedTask = {
        ...fakeTask,
        completed: true,
      };
      const updatedTask: Task = {
        ...fakeCompletedTask,
        completed: false,
      };

      taskServiceMock.update.mockReturnValue(of(updatedTask));

      facade.toggleTask(fakeCompletedTask);

      expect(taskServiceMock.update).toHaveBeenCalledWith(
        fakeCompletedTask.id,
        updatedTask,
      );
      expect(listStoreMock.updateTask).toHaveBeenCalledWith(updatedTask);
    });
  });

  describe('when deleteTask is called', () => {
    it('should delete task, update store and show success toast', () => {
      const { facade, taskServiceMock, listStoreMock, toastServiceMock } =
        setup();

      taskServiceMock.delete.mockReturnValue(of(void 0));

      facade.deleteTask(fakeTask);

      expect(taskServiceMock.delete).toHaveBeenCalledWith(fakeTask.id);
      expect(listStoreMock.removeTask).toHaveBeenCalledWith(fakeTask.id);
      expect(toastServiceMock.show).toHaveBeenCalledWith({
        type: 'success',
        title: 'Task has been deleted.',
      });
    });
  });
});
