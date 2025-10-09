import { TaskService } from '@app/shared/services/task-service';

export const createTaskServiceMock = (): Partial<jest.Mocked<TaskService>> => ({
  getAll: jest.fn(),
});
