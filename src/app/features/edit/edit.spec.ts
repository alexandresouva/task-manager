import { Location } from '@angular/common';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { List } from '@features/list/list';
import { Task, TaskForm } from '@shared/models/task.model';
import { tasksMock } from '@testing/data/tasks.mock';
import { TestHelper } from '@testing/test-helper/test-helper';
import { MockComponent, MockService } from 'ng-mocks';

import { Edit } from './edit';
import { EditFacade } from './edit-facade';

function setup() {
  const editFacadeMock = MockService(EditFacade) as jest.Mocked<EditFacade>;

  TestBed.configureTestingModule({
    imports: [Edit],
    providers: [
      { provide: EditFacade, useValue: editFacadeMock },
      provideRouter([{ path: 'tasks', component: MockComponent(List) }]),
    ],
  });

  const fixture = TestBed.createComponent(Edit);
  const testHelper = new TestHelper(fixture);
  const component = fixture.componentInstance;

  fixture.componentRef.setInput('task', tasksMock[0]);
  fixture.detectChanges();

  return { fixture, component, testHelper, editFacadeMock };
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
    it('should call facade when form is submitted and valid', () => {
      const { testHelper, editFacadeMock } = setup();

      const updatedTask: TaskForm = {
        title: 'Edited Task',
        completed: true,
      };

      testHelper.trigger.input('task-title-input', updatedTask.title);
      testHelper.trigger.checkboxChange(
        'task-completed-checkbox',
        updatedTask.completed,
      );

      testHelper.trigger.submit('edit-task-form');

      expect(editFacadeMock.updateTask).toHaveBeenCalledWith(
        tasksMock[0].id,
        updatedTask,
      );
    });

    it('should not call facade when form is invalid', () => {
      const { testHelper, editFacadeMock } = setup();

      testHelper.trigger.input('task-title-input', '');
      testHelper.trigger.submit('edit-task-form');

      expect(editFacadeMock.updateTask).not.toHaveBeenCalled();
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
