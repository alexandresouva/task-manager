import { Component, computed, signal } from '@angular/core';
import { Task } from './models/tasks.model';

@Component({
  selector: 'app-list',
  imports: [],
  templateUrl: './list.html',
  styleUrl: './list.scss',
})
export class List {
  protected readonly tasks = signal<Task[]>([
    { id: 1, description: 'Learn Angular', completed: false },
    { id: 2, description: 'Build a Todo App', completed: false },
    { id: 3, description: 'Setup Tailwind', completed: true },
    { id: 4, description: 'Install DaisyUI', completed: true },
  ]);

  protected completedTasks = computed(() =>
    this.tasks().filter((task) => task.completed),
  );

  protected pendingTasks = computed(() =>
    this.tasks().filter((task) => !task.completed),
  );
}
