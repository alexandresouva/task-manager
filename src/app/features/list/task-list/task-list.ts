import { Component, input, output } from '@angular/core';

import { CustomButton } from '@shared/directives/custom-button/custom-button';
import { Task } from '@shared/models/task.model';

@Component({
  selector: 'app-task-list',
  imports: [CustomButton],
  templateUrl: './task-list.html',
})
export class TaskList {
  readonly listTitle = input.required<string>();
  readonly tasks = input.required<Task[]>();
  readonly emptyListMessage = input<string>('No tasks found.');

  readonly toggled = output<Task>();
  readonly deleted = output<Task>();
  readonly edited = output<Task>();

  protected emitTaskToggled(task: Task): void {
    this.toggled.emit(task);
  }

  protected emitTaskDeleted(task: Task): void {
    this.deleted.emit(task);
  }

  protected emitTaskEdited(task: Task): void {
    this.edited.emit(task);
  }
}
