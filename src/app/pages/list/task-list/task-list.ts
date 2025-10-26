import { Component, input, output } from '@angular/core';

import { Task } from '@shared/models/task.model';

@Component({
  selector: 'app-task-list',
  imports: [],
  templateUrl: './task-list.html',
})
export class TaskList {
  readonly listTitle = input.required<string>();
  readonly tasks = input.required<Task[]>();
  readonly emptyListMessage = input<string>('No tasks found.');

  readonly toggled = output<Task>();
  readonly deleted = output<Task>();

  protected emitTaskToggled(task: Task): void {
    this.toggled.emit(task);
  }

  protected emitTaskDeleted(task: Task): void {
    this.deleted.emit(task);
  }
}
