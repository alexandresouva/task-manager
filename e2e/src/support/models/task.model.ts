export type Task = {
  id: number;
  title: string;
  completed: boolean;
};

export type TasksCounts = {
  pending: number;
  completed: number;
};

export type TaskType = 'pending' | 'completed';
