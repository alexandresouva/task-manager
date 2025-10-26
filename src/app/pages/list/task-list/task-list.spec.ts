import { TestBed } from '@angular/core/testing';

import { tasksMock } from '@testing/data/tasks.mock';
import { TestHelper } from '@testing/helpers/test-helper';

import { TaskList } from './task-list';

async function setup() {
  TestBed.configureTestingModule({
    imports: [TaskList],
  });
  await TestBed.compileComponents();

  const fixture = TestBed.createComponent(TaskList);
  const component = fixture.componentInstance;
  const testHelper = new TestHelper(fixture);

  fixture.componentRef.setInput('listTitle', 'Initial Title');
  fixture.componentRef.setInput('tasks', []);
  fixture.detectChanges();

  return { component, fixture, testHelper };
}

describe('TaskList', () => {
  it('should create', async () => {
    const { component } = await setup();
    expect(component).toBeTruthy();
  });

  it('should render tasks list title', async () => {
    const { fixture, testHelper } = await setup();
    const fakeTitle = 'Fake Title';

    fixture.componentRef.setInput('listTitle', fakeTitle);
    fixture.detectChanges();

    const title = testHelper.getTextContentByTestId('tasks-list-title');
    expect(title).toBe(fakeTitle);
  });

  it('should emit toggled event when some task is toggled', async () => {
    const { component, fixture, testHelper } = await setup();
    const emitSpy = jest.spyOn(component.toggled, 'emit');
    const fakeTask = tasksMock[0];

    fixture.componentRef.setInput('tasks', [fakeTask]);
    fixture.detectChanges();

    const checkbox = testHelper.queryByTestId('task-checkbox');
    checkbox.triggerEventHandler('change', null);

    expect(emitSpy).toHaveBeenCalledWith(fakeTask);
  });

  it('should emit delete event when some task is deleted', async () => {
    const { component, fixture, testHelper } = await setup();
    const deleteSpy = jest.spyOn(component.deleted, 'emit');
    const fakeTask = tasksMock[0];

    fixture.componentRef.setInput('tasks', [fakeTask]);
    fixture.detectChanges();
    testHelper.triggerClickByTestId('delete-task-button');

    expect(deleteSpy).toHaveBeenCalledWith(fakeTask);
  });

  describe('when tasks input changes', () => {
    it('should show tasks if some tasks are provided', async () => {
      const { component, fixture, testHelper } = await setup();
      const fakeTasks = [...tasksMock];

      fixture.componentRef.setInput('tasks', fakeTasks);
      fixture.detectChanges();

      const emptyTasksDebug = testHelper.queryByTestId('empty-tasks');
      const tasks = component['tasks']();
      const tasksDebug = testHelper.queryAllByTestId('task-description');

      expect(emptyTasksDebug).toBeNull();
      expect(tasks.length).toBe(fakeTasks.length);
      expect(tasksDebug.length).toBe(fakeTasks.length);
    });

    it('should show empty tasks message if no tasks are provided', async () => {
      const { component, fixture, testHelper } = await setup();
      fixture.componentRef.setInput('tasks', []);
      fixture.detectChanges();

      const emptyTasksContent =
        testHelper.getTextContentByTestId('empty-tasks');
      const tasks = component['tasks']();
      const tasksDebug = testHelper.queryAllByTestId('task-description');

      expect(emptyTasksContent).toBe('No tasks found.');
      expect(tasks.length).toBe(0);
      expect(tasksDebug.length).toBe(0);
    });

    it('should show custom empty tasks message if tasks is empty and custom message is provided', async () => {
      const { fixture, testHelper } = await setup();
      const fakeCustomMessage = 'Fake custom empty message';

      fixture.componentRef.setInput('tasks', []);
      fixture.componentRef.setInput('emptyListMessage', fakeCustomMessage);
      fixture.detectChanges();

      const emptyTasksContent =
        testHelper.getTextContentByTestId('empty-tasks');
      expect(emptyTasksContent).toBe(fakeCustomMessage);
    });
  });
});
