import { TaskService } from '@app/shared/services/tasks/task-service';

export const createTaskServiceMock = (): Partial<jest.Mocked<TaskService>> => ({
  getAll: jest.fn(),
});
