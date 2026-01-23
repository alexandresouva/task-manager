import { computed } from '@angular/core';

import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Task } from '@shared/models/task.model';

type TasksState = {
  tasks: Task[];
  isLoading: boolean;
};

const initialState: TasksState = {
  tasks: [],
  isLoading: false,
};

export const ListStore = signalStore(
  withState(initialState),

  withComputed(({ tasks }) => ({
    pendingTasks: computed(() => tasks().filter((task) => !task.completed)),
    completedTasks: computed(() => tasks().filter((task) => task.completed)),
  })),

  withMethods((store) => ({
    setTasks(tasks: Task[]): void {
      patchState(store, { tasks });
    },
    addTask(task: Task): void {
      patchState(store, {
        tasks: [...store.tasks(), task],
      });
    },
    updateTask(task: Task): void {
      patchState(store, {
        tasks: store.tasks().map((t) => (t.id === task.id ? task : t)),
      });
    },
    removeTask(taskId: number): void {
      patchState(store, {
        tasks: store.tasks().filter((task) => task.id !== taskId),
      });
    },
  })),
);
