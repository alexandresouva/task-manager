import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskList } from './task-list';
import { TestHelper } from '@app/testing/helpers/test-helper';
import { tasksMock } from '@app/testing/data/tasks.mock';

describe('TaskList', () => {
  let component: TaskList;
  let fixture: ComponentFixture<TaskList>;
  let testHelper: TestHelper<TaskList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskList],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskList);
    component = fixture.componentInstance;
    testHelper = new TestHelper(fixture);

    fixture.componentRef.setInput('title', 'Initial Title');
    fixture.componentRef.setInput('tasks', []);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render tasks list title', () => {
    const fakeTitle = 'Fake Title';
    fixture.componentRef.setInput('title', fakeTitle);
    fixture.detectChanges();

    const title = testHelper.getTextContentByTestId('tasks-list-title').trim();
    expect(title).toBe(fakeTitle);
  });

  it('should show tasks when tasks input has values', () => {
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

  it('should show empty tasks message if tasks input is empty', () => {
    fixture.componentRef.setInput('tasks', []);
    fixture.detectChanges();

    const emptyTasksContent = testHelper
      .getTextContentByTestId('empty-tasks')
      .trim();
    const tasks = component['tasks']();
    const tasksDebug = testHelper.queryAllByTestId('task-description');

    expect(emptyTasksContent).toBe('Nice! No tasks pending.');
    expect(tasks.length).toBe(0);
    expect(tasksDebug.length).toBe(0);
  });

  it('should show custom empty tasks message if tasks input is empty and custom message is provided', () => {
    const fakeCustomMessage = 'Fake custom empty message';

    fixture.componentRef.setInput('tasks', []);
    fixture.componentRef.setInput('emptyListMessage', fakeCustomMessage);
    fixture.detectChanges();

    const emptyTasksContent = testHelper
      .getTextContentByTestId('empty-tasks')
      .trim();
    expect(emptyTasksContent).toBe('Nice! No tasks pending.');
  });
});
