import { Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-task',
  imports: [ReactiveFormsModule],
  templateUrl: './create-task.html',
  styleUrl: './create-task.scss',
})
export class CreateTask {
  private readonly fb = inject(FormBuilder);

  readonly created = output<string>();

  readonly form = this.fb.nonNullable.group({
    description: ['', Validators.required],
  });

  protected emitTaskCreated(): void {
    if (this.form.invalid) return;

    const { description } = this.form.value;
    this.created.emit(description);
    this.form.reset();
  }
}
