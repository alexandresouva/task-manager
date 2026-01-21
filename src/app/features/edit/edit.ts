import { Component, effect, inject, input as routeInput } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { CustomButton } from '@shared/directives/custom-button/custom-button';
import type { Task, TaskForm } from '@shared/models/task.model';

import { EditFacade } from './edit-facade';

@Component({
  selector: 'app-edit',
  imports: [ReactiveFormsModule, CustomButton],
  templateUrl: './edit.html',
})
export class Edit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  private readonly editFacade = inject(EditFacade);

  readonly task = routeInput.required<Task>();

  readonly taskForm = this.fb.group({
    title: this.fb.control<string>('', { validators: Validators.required }),
    completed: this.fb.control<boolean>(false),
  });

  constructor() {
    this.loadFormDataEffect();
  }

  protected updateTask(): void {
    if (this.taskForm.invalid) return;

    const task: TaskForm = this.taskForm.getRawValue();
    this.editFacade.updateTask(this.task().id, task);
  }

  protected navigateToTaskList(): void {
    this.router.navigateByUrl('/tasks');
  }

  private loadFormDataEffect(): void {
    effect(() => {
      const task = this.task();
      if (!task) return;

      this.taskForm.patchValue(task);
    });
  }
}
