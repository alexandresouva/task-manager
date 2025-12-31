import { Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { CustomButton } from '@shared/directives/custom-button/custom-button';

@Component({
  selector: 'app-create-task',
  imports: [ReactiveFormsModule, CustomButton],
  templateUrl: './create-task.html',
})
export class CreateTask {
  private readonly fb = inject(FormBuilder);

  readonly created = output<string>();

  readonly form = this.fb.nonNullable.group({
    title: ['', Validators.required],
  });

  protected emitTaskCreated(): void {
    if (this.form.invalid) return;

    const { title } = this.form.value;
    this.created.emit(title);
    this.form.reset();
  }
}
