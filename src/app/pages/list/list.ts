import { Component, computed, inject, OnInit, signal } from '@angular/core';

import { Task } from '@shared/models/task.model';
import { TaskService } from '@shared/services/task-service';
import { ToastService } from '@shared/services/toast-service';

import { CreateTask } from './create-task/create-task';
import { TaskList } from './task-list/task-list';

@Component({
  selector: 'app-list',
  imports: [TaskList, CreateTask],
  templateUrl: './list.html',
})
export class List implements OnInit {
  private readonly taskService = inject(TaskService);
  private readonly toastService = inject(ToastService);

  protected readonly tasks = signal<Task[]>([]);
  protected readonly completedTasks = computed(() =>
    this.tasks().filter((task) => task.completed),
  );
  protected readonly pendingTasks = computed(() =>
    this.tasks().filter((task) => !task.completed),
  );

  ngOnInit(): void {
    this.loadTasks();
  }

  protected loadTasks(): void {
    this.taskService.getAll().subscribe((tasks) => this.tasks.set(tasks));
  }

  protected updateTask(task: Task): void {
    const updatedTask = { ...task, completed: !task.completed };
    this.taskService.update(task.id, updatedTask).subscribe((updatedTask) => {
      this.tasks.update((tasks) =>
        tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
      );
    });
  }

  protected deleteTask(task: Task): void {
    this.taskService.delete(task.id).subscribe(() => {
      this.tasks.update((tasks) => tasks.filter((t) => t.id !== task.id));
    });

    this.toastService.show({
      type: 'success',
      title: 'Task has been deleted.',
    });
  }

  protected createTask(taskName: string): void {
    this.taskService.create(taskName).subscribe((newTask) => {
      this.tasks.update((tasks) => [...tasks, newTask]);
    });

    this.toastService.show({
      type: 'success',
      title: 'Task has been added.',
    });
  }
}
