import { TestBed } from '@angular/core/testing';

import { Task, TaskForm } from '@shared/models/task.model';
import { TaskService } from '@shared/services/task-service';
import { tasksMock } from '@testing/data/tasks.mock';
import { TestHelper } from '@testing/helpers/test-helper';
import { MockProvider, MockService } from 'ng-mocks';
import { of } from 'rxjs';

import { Edit } from './edit';

async function setup() {
  const taskServiceMock = MockService(TaskService) as jest.Mocked<TaskService>;
  await TestBed.configureTestingModule({
    imports: [Edit],
    providers: [MockProvider(TaskService, taskServiceMock)],
  }).compileComponents();

  const fixture = TestBed.createComponent(Edit);

  const testHelper = new TestHelper(fixture);
  const component = fixture.componentInstance;

  taskServiceMock.getById.mockReturnValue(of(tasksMock[0]));
  fixture.componentRef.setInput('id', 12043);
  fixture.detectChanges();

  return { fixture, component, testHelper, taskServiceMock };
}

describe('EditTask', () => {
  it('should create', async () => {
    const { component } = await setup();
    expect(component).toBeTruthy();
  });

  describe('when task id is provided', () => {
    const fakeTask: Task = {
      id: 1,
      title: 'Test Task',
      completed: false,
    };

    it('should load data in the form if task id is valid', async () => {
      const { fixture, testHelper, taskServiceMock } = await setup();

      taskServiceMock.getById.mockReturnValue(of(fakeTask));
      fixture.componentRef.setInput('id', fakeTask.id);
      fixture.detectChanges();

      const inputTitle = testHelper.getValueByTestId('task-title-input');
      const checkboxCompleted = testHelper.getCheckedByTestId(
        'task-completed-checkbox',
      );

      expect(inputTitle).toEqual(fakeTask.title);
      expect(checkboxCompleted).toBe(fakeTask.completed);
    });

    it('should NOT load task data when taskId is invalid', async () => {
      const { fixture, testHelper, taskServiceMock } = await setup();
      jest.resetAllMocks();

      const initialTitle = testHelper.getValueByTestId('task-title-input');
      const initialCompleted = testHelper.getCheckedByTestId(
        'task-completed-checkbox',
      );
      taskServiceMock.getById.mockReturnValue(of(fakeTask));
      fixture.componentRef.setInput('id', undefined);
      fixture.detectChanges();

      expect(taskServiceMock.getById).not.toHaveBeenCalled();

      const finalTitle = testHelper.getValueByTestId('task-title-input');
      const finalCheckboxCompleted = testHelper.getCheckedByTestId(
        'task-completed-checkbox',
      );

      expect(initialTitle).toBe(finalTitle);
      expect(initialCompleted).toBe(finalCheckboxCompleted);
    });
  });

  describe('when task id value is updated', () => {
    const initialTask: Task = {
      id: 1,
      title: 'Initial Test Task',
      completed: false,
    };
    const updatedTask: TaskForm = {
      title: 'Updated Test Task',
      completed: true,
    };

    it('should update form data when a task is found', async () => {
      const { fixture, testHelper, taskServiceMock } = await setup();

      taskServiceMock.getById.mockReturnValue(of(initialTask));
      fixture.componentRef.setInput('id', initialTask.id);
      fixture.detectChanges();

      let inputTitle = testHelper.getValueByTestId('task-title-input');
      let checkboxCompleted = testHelper.getCheckedByTestId(
        'task-completed-checkbox',
      );
      expect(inputTitle).toEqual(initialTask.title);
      expect(checkboxCompleted).toBe(initialTask.completed);

      testHelper.dispatchInputEventByTestId(
        'task-title-input',
        updatedTask.title,
      );
      testHelper.dispatchCheckboxChangeByTestId(
        'task-completed-checkbox',
        updatedTask.completed,
      );
      fixture.detectChanges();

      inputTitle = testHelper.getValueByTestId('task-title-input');
      checkboxCompleted = testHelper.getCheckedByTestId(
        'task-completed-checkbox',
      );
      expect(inputTitle).toEqual(updatedTask.title);
      expect(checkboxCompleted).toBe(updatedTask.completed);
    });
  });

  describe('when form is submitted', () => {
    const originalTask: Task = {
      id: 1,
      title: 'Initial Test Task',
      completed: true,
    };

    it('should update task if form is valid', async () => {
      const { fixture, testHelper, taskServiceMock } = await setup();
      const updatedTask: TaskForm = {
        title: 'Edited Test Task',
        completed: true,
      };

      taskServiceMock.getById.mockReturnValue(of(originalTask));
      fixture.componentRef.setInput('id', originalTask.id);
      fixture.detectChanges();

      taskServiceMock.update.mockReturnValue(of(null));
      testHelper.triggerInputByTestId('task-title-input', updatedTask.title);
      testHelper.triggerCheckboxChangeByTestId(
        'task-completed-checkbox',
        updatedTask.completed,
      );
      fixture.detectChanges();
      testHelper.triggerFormSubmitByTestId('edit-task-form', null);

      expect(taskServiceMock.update).toHaveBeenCalledWith(
        originalTask.id,
        updatedTask,
      );
    });

    it('should not update task if form is invalid', async () => {
      const { fixture, testHelper, taskServiceMock } = await setup();
      const invalidTask: TaskForm = {
        title: '',
        completed: true,
      };

      taskServiceMock.getById.mockReturnValue(of(originalTask));
      fixture.componentRef.setInput('id', originalTask.id);
      fixture.detectChanges();

      testHelper.dispatchInputEventByTestId(
        'task-title-input',
        invalidTask.title,
      );
      fixture.detectChanges();
      testHelper.dispatchClickEventByTestId('submit-task-button');

      expect(taskServiceMock.update).not.toHaveBeenCalled();
    });
  });
});
