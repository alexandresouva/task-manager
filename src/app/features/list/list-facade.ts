import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Task } from '@shared/models/task.model';
import { TaskService } from '@shared/services/task-service';
import { ToastService } from '@shared/services/toast-service';

import { ListStore } from './list-store';

@Injectable()
export class ListFacade {
  private readonly destroyRef = inject(DestroyRef);
  private readonly taskService = inject(TaskService);
  private readonly toastService = inject(ToastService);
  private readonly listStore = inject(ListStore);

  readonly pendingTasks = this.listStore.pendingTasks;
  readonly completedTasks = this.listStore.completedTasks;

  loadTasks(): void {
    this.taskService
      .getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (tasks) => this.listStore.setTasks(tasks),
        error: () =>
          this.toastService.show({
            type: 'error',
            title: 'Could not load tasks.',
            message: 'Please try again later.',
          }),
      });
  }

  createTask(taskName: string): void {
    this.taskService
      .create(taskName)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((task) => {
        this.listStore.addTask(task);

        this.toastService.show({
          type: 'success',
          title: 'Task has been added.',
        });
      });
  }

  toggleTask(task: Task): void {
    const updatedTask = { ...task, completed: !task.completed };

    this.taskService
      .update(task.id, updatedTask)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((task) => this.listStore.updateTask(task));
  }

  deleteTask(task: Task): void {
    this.taskService
      .delete(task.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.listStore.removeTask(task.id);

        this.toastService.show({
          type: 'success',
          title: 'Task has been deleted.',
        });
      });
  }
}
