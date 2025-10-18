import { Component, input, output } from '@angular/core';

import { Task } from '@app/shared/models/tasks.model';

@Component({
  selector: 'app-task-list',
  imports: [],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})
export class TaskList {
  readonly title = input.required<string>();
  readonly tasks = input.required<Task[]>();
  readonly emptyListMessage = input<string>('No tasks found.');

  readonly toggled = output<Task>();

  protected emitTaskToggled(task: Task): void {
    this.toggled.emit(task);
  }
}
