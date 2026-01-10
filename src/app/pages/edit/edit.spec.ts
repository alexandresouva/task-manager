import { Location } from '@angular/common';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { List } from '@pages/list/list';
import { Task, TaskForm } from '@shared/models/task.model';
import { TaskService } from '@shared/services/task-service';
import { ToastService } from '@shared/services/toast-service';
import { tasksMock } from '@testing/data/tasks.mock';
import { TestHelper } from '@testing/test-helper/test-helper';
import { MockComponent, MockService } from 'ng-mocks';
import { of } from 'rxjs';

import { Edit } from './edit';

function setup() {
  const taskServiceMock = MockService(TaskService) as jest.Mocked<TaskService>;
  const toastServiceMock = MockService(
    ToastService,
  ) as jest.Mocked<ToastService>;

  TestBed.configureTestingModule({
    imports: [Edit],
    providers: [
      { provide: TaskService, useValue: taskServiceMock },
      { provide: ToastService, useValue: toastServiceMock },
      provideRouter([{ path: 'tasks', component: MockComponent(List) }]),
    ],
  });

  const fixture = TestBed.createComponent(Edit);

  const testHelper = new TestHelper(fixture);
  const component = fixture.componentInstance;

  taskServiceMock.getById.mockReturnValue(of(tasksMock[0]));
  fixture.componentRef.setInput('task', tasksMock[0]);
  fixture.detectChanges();

  return { fixture, component, testHelper, taskServiceMock, toastServiceMock };
}

describe('EditTask', () => {
  it('should create', () => {
    const { component } = setup();
    expect(component).toBeTruthy();
  });

  describe('when task changes', () => {
    it('should load data in the form if task id is valid', () => {
      const { fixture, testHelper } = setup();
      const fakeTask: Task = {
        id: 1,
        title: 'Test Task',
        completed: false,
      };

      fixture.componentRef.setInput('task', fakeTask);
      fixture.detectChanges();

      const inputTitle = testHelper.queries.getValue('task-title-input');
      const checkboxCompleted = testHelper.queries.getChecked(
        'task-completed-checkbox',
      );

      expect(inputTitle).toEqual(fakeTask.title);
      expect(checkboxCompleted).toBe(fakeTask.completed);
    });

    it('should NOT load task data when taskId is invalid', () => {
      const { fixture, testHelper } = setup();

      const initialTitle = testHelper.queries.getValue('task-title-input');
      const initialCompleted = testHelper.queries.getChecked(
        'task-completed-checkbox',
      );

      fixture.componentRef.setInput('task', undefined);
      fixture.detectChanges();

      const finalTitle = testHelper.queries.getValue('task-title-input');
      const finalCheckboxCompleted = testHelper.queries.getChecked(
        'task-completed-checkbox',
      );

      expect(initialTitle).toBe(finalTitle);
      expect(initialCompleted).toBe(finalCheckboxCompleted);
    });
  });

  describe('when form is submitted', () => {
    const originalTask: Task = {
      id: 1,
      title: 'Initial Test Task',
      completed: true,
    };

    it('should update task if form is valid', () => {
      const { fixture, testHelper, taskServiceMock } = setup();
      const updatedTask: TaskForm = {
        title: 'Edited Test Task',
        completed: true,
      };

      taskServiceMock.getById.mockReturnValue(of(originalTask));
      fixture.detectChanges();

      taskServiceMock.update.mockReturnValue(of(null));
      testHelper.trigger.input('task-title-input', updatedTask.title);
      testHelper.trigger.checkboxChange(
        'task-completed-checkbox',
        updatedTask.completed,
      );
      fixture.detectChanges();
      testHelper.trigger.submit('edit-task-form');

      expect(taskServiceMock.update).toHaveBeenCalledWith(
        originalTask.id,
        updatedTask,
      );
    });

    it('should display success toast after updating task', () => {
      const {
        fixture,
        component,
        testHelper,
        taskServiceMock,
        toastServiceMock,
      } = setup();
      const updatedTask: TaskForm = {
        title: 'Edited Test Task',
        completed: true,
      };

      taskServiceMock.update.mockReturnValue(of(tasksMock[0]));
      component['taskForm'].patchValue(updatedTask);
      fixture.detectChanges();
      testHelper.trigger.submit('edit-task-form');

      expect(toastServiceMock.show).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'success' }),
      );
    });

    it('should not update task if form is invalid', () => {
      const { fixture, testHelper, taskServiceMock } = setup();
      const invalidTask: TaskForm = {
        title: '',
        completed: true,
      };

      taskServiceMock.getById.mockReturnValue(of(originalTask));
      fixture.detectChanges();

      testHelper.dispatch.input('task-title-input', invalidTask.title);
      fixture.detectChanges();
      testHelper.dispatch.click('submit-task-button');

      expect(taskServiceMock.update).not.toHaveBeenCalled();
    });
  });

  describe('when back button is clicked', () => {
    it('should navigate back to task list', fakeAsync(() => {
      const { testHelper } = setup();
      const location = TestBed.inject(Location);

      testHelper.dispatch.click('back-button');
      tick();

      expect(location.path()).toBe('/tasks');
    }));
  });
});
