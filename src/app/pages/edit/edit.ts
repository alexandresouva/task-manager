import { Component, effect, inject, input as routeInput } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { TaskForm } from '@shared/models/task.model';
import { TaskService } from '@shared/services/task-service';

@Component({
  selector: 'app-edit',
  imports: [ReactiveFormsModule],
  templateUrl: './edit.html',
})
export class Edit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly taskService = inject(TaskService);

  readonly taskId = routeInput.required({ alias: 'id', transform: Number });

  readonly taskForm = this.fb.group({
    title: this.fb.control<string>('', { validators: Validators.required }),
    completed: this.fb.control<boolean>(false),
  });

  constructor() {
    this.loadFormDataEffect();
  }

  onSubmit(): void {
    if (this.taskForm.invalid) return;

    const task: TaskForm = this.taskForm.getRawValue();
    this.taskService.update(this.taskId(), task).subscribe();
  }

  private loadFormDataEffect(): void {
    effect(() => {
      const taskId = this.taskId();
      if (!taskId) return;

      this.taskService
        .getById(taskId)
        .subscribe((task) => this.taskForm.patchValue(task));
    });
  }
}
