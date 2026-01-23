import { TestBed } from '@angular/core/testing';

import { Task } from '@shared/models/task.model';
import { tasksMock } from '@testing/data/tasks.mock';

import { ListStore } from './list-store';

function setup() {
  TestBed.configureTestingModule({
    providers: [ListStore],
  });

  const store = TestBed.inject(ListStore);

  return { store };
}

describe('ListStore', () => {
  it('should be created', () => {
    const { store } = setup();
    expect(store).toBeTruthy();
  });

  describe('initial state', () => {
    it('should start with no tasks', () => {
      const { store } = setup();

      expect(store.pendingTasks()).toEqual([]);
      expect(store.completedTasks()).toEqual([]);
    });
  });

  describe('when setTasks is called', () => {
    it('should populate pending and completed tasks correctly', () => {
      const { store } = setup();

      const tasks: Task[] = [
        { id: 1, title: 'Pending task', completed: false },
        { id: 2, title: 'Completed task', completed: true },
      ];

      store.setTasks(tasks);

      expect(store.pendingTasks()).toEqual([tasks[0]]);
      expect(store.completedTasks()).toEqual([tasks[1]]);
    });
  });

  describe('when addTask is called', () => {
    it('should add the task', () => {
      const { store } = setup();
      const fakeTask = tasksMock[0];

      store.addTask(fakeTask);

      expect(store.tasks()).toEqual([fakeTask]);
    });
  });

  describe('when updateTask is called', () => {
    it('should update an existing task', () => {
      const { store } = setup();
      const fakeTask = tasksMock[0];
      const updatedTask: Task = {
        ...fakeTask,
        completed: true,
      };

      store.setTasks([fakeTask]);
      store.updateTask(updatedTask);

      expect(store.tasks()).toEqual([updatedTask]);
    });

    it('should not update a task that does not exist', () => {
      const { store } = setup();
      const fakeTask = tasksMock[0];
      const updatedTask: Task = {
        ...fakeTask,
        completed: true,
      };

      store.setTasks(tasksMock.slice(1));
      store.updateTask(updatedTask);

      expect(store.tasks()).not.toContain(updatedTask);
    });
  });

  describe('when removeTask is called', () => {
    it('should remove the task by id', () => {
      const { store } = setup();
      const fakeTask = tasksMock[0];

      store.setTasks([fakeTask]);

      store.removeTask(fakeTask.id);

      expect(store.tasks()).toEqual([]);
    });
  });
});
