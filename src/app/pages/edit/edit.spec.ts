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
  fixture.componentRef.setInput('task', tasksMock[0]);
  fixture.detectChanges();

  return { fixture, component, testHelper, taskServiceMock };
}

describe('EditTask', () => {
  it('should create', async () => {
    const { component } = await setup();
    expect(component).toBeTruthy();
  });

  describe('when task changes', () => {
    it('should load data in the form if task id is valid', async () => {
      const { fixture, testHelper } = await setup();
      const fakeTask: Task = {
        id: 1,
        title: 'Test Task',
        completed: false,
      };

      fixture.componentRef.setInput('task', fakeTask);
      fixture.detectChanges();

      const inputTitle = testHelper.getValueByTestId('task-title-input');
      const checkboxCompleted = testHelper.getCheckedByTestId(
        'task-completed-checkbox',
      );

      expect(inputTitle).toEqual(fakeTask.title);
      expect(checkboxCompleted).toBe(fakeTask.completed);
    });

    it('should NOT load task data when taskId is invalid', async () => {
      const { fixture, testHelper } = await setup();

      const initialTitle = testHelper.getValueByTestId('task-title-input');
      const initialCompleted = testHelper.getCheckedByTestId(
        'task-completed-checkbox',
      );

      fixture.componentRef.setInput('task', undefined);
      fixture.detectChanges();

      const finalTitle = testHelper.getValueByTestId('task-title-input');
      const finalCheckboxCompleted = testHelper.getCheckedByTestId(
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

    it('should update task if form is valid', async () => {
      const { fixture, testHelper, taskServiceMock } = await setup();
      const updatedTask: TaskForm = {
        title: 'Edited Test Task',
        completed: true,
      };

      taskServiceMock.getById.mockReturnValue(of(originalTask));
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
