import { fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';

import { TaskService } from './task-service';
import { Task } from '@app/shared/models/tasks.model';

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Method 1: fakeAsync
  it('should return tasks - fakeAsync', fakeAsync(() => {
    let result: Task[] | undefined;

    service.getAll().subscribe((tasks) => {
      result = tasks;
    });

    tick(2000);

    expect(result).not.toBeUndefined();
    expect(result).toStrictEqual([
      { id: 1, description: 'Learn Angular', completed: false },
      { id: 2, description: 'Build a Todo App', completed: false },
      { id: 3, description: 'Setup Tailwind', completed: true },
      { id: 4, description: 'Install DaisyUI', completed: true },
    ]);
  }));

  // Method 2: done
  it('should return tasks - done', (done) => {
    service.getAll().subscribe((tasks) => {
      expect(tasks).not.toBeUndefined();
      expect(tasks).toStrictEqual([
        { id: 1, description: 'Learn Angular', completed: false },
        { id: 2, description: 'Build a Todo App', completed: false },
        { id: 3, description: 'Setup Tailwind', completed: true },
        { id: 4, description: 'Install DaisyUI', completed: true },
      ]);
      done();
    });
  });

  // Method 3: waitForAsync
  it('should return tasks - waitForAsync', waitForAsync(() => {
    service.getAll().subscribe((tasks) => {
      expect(tasks).not.toBeUndefined();
      expect(tasks).toStrictEqual([
        { id: 1, description: 'Learn Angular', completed: false },
        { id: 2, description: 'Build a Todo App', completed: false },
        { id: 3, description: 'Setup Tailwind', completed: true },
        { id: 4, description: 'Install DaisyUI', completed: true },
      ]);
    });
  }));
});
