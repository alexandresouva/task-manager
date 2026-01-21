import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { TaskForm } from '@shared/models/task.model';
import { TaskService } from '@shared/services/task-service';
import { ToastService } from '@shared/services/toast-service';
import { MockService } from 'ng-mocks';
import { of, throwError } from 'rxjs';

import { EditFacade } from './edit-facade';

function setup() {
  const taskServiceMock = MockService(TaskService) as jest.Mocked<TaskService>;
  const toastServiceMock = MockService(
    ToastService,
  ) as jest.Mocked<ToastService>;

  TestBed.configureTestingModule({
    providers: [
      EditFacade,
      provideRouter([]),
      { provide: TaskService, useValue: taskServiceMock },
      { provide: ToastService, useValue: toastServiceMock },
    ],
  });

  const facade = TestBed.inject(EditFacade);
  const router = TestBed.inject(Router);

  return { facade, router, taskServiceMock, toastServiceMock };
}

describe('EditFacade', () => {
  it('should be created', () => {
    const { facade } = setup();
    expect(facade).toBeTruthy();
  });

  describe('updateTask', () => {
    const taskId = 1;
    const task: TaskForm = {
      title: 'Updated task',
      completed: true,
    };

    it('should update task and navigate to tasks list on success', () => {
      const { facade, taskServiceMock, toastServiceMock, router } = setup();
      const navigateSpy = jest.spyOn(router, 'navigateByUrl');

      taskServiceMock.update.mockReturnValue(of(null));

      facade.updateTask(taskId, task);

      expect(taskServiceMock.update).toHaveBeenCalledWith(taskId, task);
      expect(navigateSpy).toHaveBeenCalledWith('/tasks');
      expect(toastServiceMock.show).toHaveBeenCalledWith({
        type: 'success',
        title: 'Task has been updated.',
      });
    });

    it('should show error toast when update fails', () => {
      const { facade, taskServiceMock, toastServiceMock, router } = setup();
      const navigateSpy = jest.spyOn(router, 'navigateByUrl');

      taskServiceMock.update.mockReturnValue(
        throwError(() => new Error('Update failed')),
      );

      facade.updateTask(taskId, task);

      expect(taskServiceMock.update).toHaveBeenCalledWith(taskId, task);
      expect(navigateSpy).not.toHaveBeenCalled();
      expect(toastServiceMock.show).toHaveBeenCalledWith({
        type: 'error',
        title: 'We couldn’t update this task.',
        message:
          'Something went wrong while saving your changes. Please try again.',
      });
    });
  });
});
