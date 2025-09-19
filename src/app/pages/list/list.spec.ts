import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';

import { TaskService } from '@shared/services/tasks/task-service';
import { Task } from '@shared/models/tasks.model';
import { createTaskServiceMock } from '@testing/mocks/tasks-service.mock';
import { tasksMock } from '@testing/data/tasks.mock';
import { List } from './list';

describe('List', () => {
  let component: List;
  let fixture: ComponentFixture<List>;

  const taskServiceMock = createTaskServiceMock();
  const getAllTasksSubject = new Subject<Task[]>();

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [List],
      providers: [{ provide: TaskService, useValue: taskServiceMock }],
    });
    await TestBed.compileComponents();

    taskServiceMock.getAll.mockReturnValue(getAllTasksSubject.asObservable());

    fixture = TestBed.createComponent(List);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('completedTasks', () => {
    it('should render completed tasks title', () => {
      const titleDebug = fixture.debugElement.query(
        By.css('[data-testid="completed-tasks-title"]'),
      );
      const title: string | undefined = titleDebug.nativeElement.textContent;

      expect(titleDebug).toBeTruthy();
      expect(title.trim()).toBe('Done');
    });

    it('should not have completed tasks and show appropriate message if task service returns empty', () => {
      getAllTasksSubject.next([]);
      fixture.detectChanges();

      const completedTasks = component['completedTasks']();
      const tasksDebug = fixture.debugElement.queryAll(
        By.css('[data-testid="completed-task"]'),
      );
      const emptyTasksDebug = fixture.debugElement.query(
        By.css('[data-testid="empty-completed-tasks"]'),
      );
      const emptyTasksContent = emptyTasksDebug.nativeElement.textContent;

      expect(completedTasks.length).toBe(0);
      expect(tasksDebug.length).toBe(0);
      expect(emptyTasksContent.trim()).toBe('No tasks completed yet!');
    });

    it('should return only completed tasks and render them if task service returns tasks', () => {
      getAllTasksSubject.next(tasksMock);
      fixture.detectChanges();

      const completedTasks = component['completedTasks']();
      const tasksDebug = fixture.debugElement.queryAll(
        By.css('[data-testid="completed-task"]'),
      );
      const emptyTasksDebug = fixture.debugElement.query(
        By.css('[data-testid="empty-completed-tasks"]'),
      );

      expect(emptyTasksDebug).toBeNull();
      expect(completedTasks.length).toBe(2);
      expect(tasksDebug.length).toBe(2);
      expect(tasksDebug[0].nativeElement.textContent).toContain('Task 1');
      expect(tasksDebug[1].nativeElement.textContent).toContain('Task 3');
    });
  });

  describe('pendingTasks', () => {
    it('should render pending tasks title', () => {
      const titleDebug = fixture.debugElement.query(
        By.css('[data-testid="pending-tasks-title"]'),
      );
      const title: string = titleDebug.nativeElement.textContent;

      expect(titleDebug).toBeTruthy();
      expect(title.trim()).toBe('Todo');
    });

    it('should not have pending tasks and show appropriate message if task service returns empty', () => {
      getAllTasksSubject.next([]);
      fixture.detectChanges();

      const pendingTasks = component['pendingTasks']();
      const tasksDebug = fixture.debugElement.queryAll(
        By.css('[data-testid="pending-task"]'),
      );
      const emptyTasksDebug = fixture.debugElement.query(
        By.css('[data-testid="empty-pending-tasks"]'),
      );
      const emptyTasksContent = emptyTasksDebug.nativeElement.textContent;

      expect(pendingTasks.length).toBe(0);
      expect(tasksDebug.length).toBe(0);
      expect(emptyTasksContent.trim()).toBe('Nice! No tasks pending.');
    });

    it('should return only pending tasks and render them if task service returns tasks', () => {
      getAllTasksSubject.next(tasksMock);
      fixture.detectChanges();

      const pendingTasks = component['pendingTasks']();
      const tasksDebug = fixture.debugElement.queryAll(
        By.css('[data-testid="pending-task"]'),
      );
      const emptyTasksDebug = fixture.debugElement.query(
        By.css('[data-testid="empty-pending-tasks"]'),
      );

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
