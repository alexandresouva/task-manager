import { ComponentFixture, TestBed } from '@angular/core/testing';
import { List } from './list';
import { Task } from './models/tasks.model';
import { By } from '@angular/platform-browser';

describe('List', () => {
  let component: List;
  let fixture: ComponentFixture<List>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [List],
    }).compileComponents();

    fixture = TestBed.createComponent(List);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('completedTasks', () => {
    const fakeTasks: Task[] = [
      { id: 1, description: 'Task 1', completed: true },
      { id: 2, description: 'Task 2', completed: false },
      { id: 3, description: 'Task 3', completed: true },
    ];

    beforeEach(() => {
      component['tasks'].set(fakeTasks);
      fixture.detectChanges();
    });

    it('should return only completed tasks and render them', () => {
      const completed = component['completedTasks']();
      const tasksDebug = fixture.debugElement.queryAll(
        By.css('[data-testid="completed-task"]'),
      );

      expect(completed.length).toBe(2);
      expect(tasksDebug.length).toBe(2);
      expect(tasksDebug[0].nativeElement.textContent).toContain('Task 1');
      expect(tasksDebug[1].nativeElement.textContent).toContain('Task 3');
    });

    it('should render completed tasks title', () => {
      const titleDebug = fixture.debugElement.query(
        By.css('[data-testid="completed-tasks-title"]'),
      );
      const title: string | undefined = titleDebug.nativeElement.textContent;

      expect(titleDebug).toBeTruthy();
      expect(title.trim()).toBe('Done');
    });
  });
});
