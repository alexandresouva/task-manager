import { inject } from '@angular/core';
import type { ResolveFn } from '@angular/router';

import type { Task } from '@shared/models/task.model';
import { TaskService } from '@shared/services/task-service';
import { delay } from 'rxjs';

export const getTaskByIdResolver: ResolveFn<Task> = (route) => {
  const taskService = inject(TaskService);
  const taskId = Number(route.paramMap.get('id'));

  return taskService.getById(taskId).pipe(delay(500));
};
