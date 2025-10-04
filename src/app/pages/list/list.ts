import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TaskService } from '@app/shared/services/tasks/task-service';
import { TaskList } from './task-list/task-list';

@Component({
  selector: 'app-list',
  imports: [TaskList],
  templateUrl: './list.html',
  styleUrl: './list.scss',
})
export class List {
  private readonly taskService = inject(TaskService);

  protected readonly tasks = toSignal(this.taskService.getAll(), {
    initialValue: [],
  });

  protected completedTasks = computed(() =>
    this.tasks().filter((task) => task.completed),
  );

  protected pendingTasks = computed(() =>
    this.tasks().filter((task) => !task.completed),
  );
}
