export type Task = {
  id: number;
  title: string;
  completed: boolean;
};

export type TaskForm = Omit<Task, 'id'>;
