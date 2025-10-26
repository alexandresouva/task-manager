import { TaskService } from '@shared/services/task-service';

export const createTaskServiceMock = (): Partial<jest.Mocked<TaskService>> => ({
  getAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  create: jest.fn(),
});
