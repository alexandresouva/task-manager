import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { TaskForm } from '@shared/models/task.model';
import { TaskService } from '@shared/services/task-service';
import { ToastService } from '@shared/services/toast-service';

@Injectable()
export class EditFacade {
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly taskService = inject(TaskService);
  private readonly toastService = inject(ToastService);

  updateTask(taskId: number, task: TaskForm): void {
    this.taskService
      .update(taskId, task)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/tasks');
          this.toastService.show({
            type: 'success',
            title: 'Task has been updated.',
          });
        },
        error: () => {
          this.toastService.show({
            type: 'error',
            title: 'We couldn’t update this task.',
            message:
              'Something went wrong while saving your changes. Please try again.',
          });
        },
      });
  }
}
