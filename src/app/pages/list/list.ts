import { Component, computed, inject, OnInit, signal } from '@angular/core';

import { Task } from '@app/shared/models/tasks.model';
import { TaskService } from '@app/shared/services/task-service';

import { TaskList } from './task-list/task-list';

@Component({
  selector: 'app-list',
  imports: [TaskList],
  templateUrl: './list.html',
  styleUrl: './list.scss',
})
export class List implements OnInit {
  private readonly taskService = inject(TaskService);

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
  }
}
