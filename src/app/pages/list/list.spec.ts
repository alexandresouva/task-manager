import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { TaskService } from '@shared/services/tasks/task-service';
import { Task } from '@shared/models/tasks.model';
import { createTaskServiceMock } from '@testing/mocks/tasks-service.mock';
import { tasksMock } from '@testing/data/tasks.mock';
import { List } from './list';
import { TestHelper } from '@testing/helpers/test-helper';

describe('List', () => {
  let component: List;
  let fixture: ComponentFixture<List>;
  let testHelper: TestHelper<List>;
  let taskServiceMock: Partial<jest.Mocked<TaskService>>;

  const getAllTasksSubject = new Subject<Task[]>();

  beforeEach(async () => {
    taskServiceMock = createTaskServiceMock();

    TestBed.configureTestingModule({
      imports: [List],
      providers: [{ provide: TaskService, useValue: taskServiceMock }],
    });
    await TestBed.compileComponents();

    taskServiceMock.getAll.mockReturnValue(getAllTasksSubject.asObservable());

    fixture = TestBed.createComponent(List);
    testHelper = new TestHelper(fixture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('completedTasks', () => {
    it('should render completed tasks title', () => {
      const title = testHelper
        .getTextContentByTestId('completed-tasks-title')
        .trim();

      expect(title).toBe('Done');
    });

    it('should not have completed tasks and show appropriate message if task service returns empty', () => {
      getAllTasksSubject.next([]);
      fixture.detectChanges();

      const completedTasks = component['completedTasks']();
      const tasksDebug = testHelper.queryAllByTestId('completed-task');
      const emptyTasksContent = testHelper
        .getTextContentByTestId('empty-completed-tasks')
        .trim();

      expect(completedTasks.length).toBe(0);
      expect(tasksDebug.length).toBe(0);
      expect(emptyTasksContent).toBe('No tasks completed yet!');
    });

    it('should return only completed tasks and render them if task service returns tasks', () => {
      getAllTasksSubject.next(tasksMock);
      fixture.detectChanges();

      const completedTasks = component['completedTasks']();
      const tasksDebug = testHelper.queryAllByTestId('completed-task');
      const emptyTasksDebug = testHelper.queryByTestId('empty-completed-tasks');

      expect(emptyTasksDebug).toBeNull();
      expect(completedTasks.length).toBe(2);
      expect(tasksDebug.length).toBe(2);
      expect(tasksDebug[0].nativeElement.textContent).toContain('Task 1');
      expect(tasksDebug[1].nativeElement.textContent).toContain('Task 3');
    });
  });

  describe('pendingTasks', () => {
    it('should render pending tasks title', () => {
      const title = testHelper.getTextContentByTestId('pending-tasks-title');

      expect(title.trim()).toBe('Todo');
    });

    it('should not have pending tasks and show appropriate message if task service returns empty', () => {
      getAllTasksSubject.next([]);
      fixture.detectChanges();

      const pendingTasks = component['pendingTasks']();
      const tasksDebug = testHelper.queryAllByTestId('pending-task');
      const emptyTasksContent = testHelper
        .getTextContentByTestId('empty-pending-tasks')
        .trim();

      expect(pendingTasks.length).toBe(0);
      expect(tasksDebug.length).toBe(0);
      expect(emptyTasksContent).toBe('Nice! No tasks pending.');
    });

    it('should return only pending tasks and render them if task service returns tasks', () => {
      getAllTasksSubject.next(tasksMock);
      fixture.detectChanges();

      const pendingTasks = component['pendingTasks']();
      const tasksDebug = testHelper.queryAllByTestId('pending-task');
      const emptyTasksDebug = testHelper.queryByTestId('empty-pending-tasks');

      const expectedPendingTasks = tasksMock.filter((t) => !t.completed);

      expect(emptyTasksDebug).toBeNull();
      expect(pendingTasks.length).toBe(expectedPendingTasks.length);
      expect(tasksDebug.length).toBe(expectedPendingTasks.length);

      tasksDebug.forEach((el, index) => {
        expect(el.nativeElement.textContent).toContain(
          expectedPendingTasks[index].description,
        );
      });
    });
  });
});
