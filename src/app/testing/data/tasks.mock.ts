import { Task } from '@shared/models/task.model';

export const tasksMock: Task[] = [
  { id: 1, title: 'Task 1', completed: true },
  { id: 2, title: 'Task 2', completed: false },
  { id: 3, title: 'Task 3', completed: true },
  { id: 4, title: 'Task 4', completed: false },
  { id: 5, title: 'Task 5', completed: false },
];

export const completedTasksMock = tasksMock.filter((task) => task.completed);
export const pendingTasksMock = tasksMock.filter((task) => !task.completed);
