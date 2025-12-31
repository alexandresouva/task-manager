import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '@shared/services/auth-service';
import { ToastService } from '@shared/services/toast-service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  /* Initialize with correct credentials to easily test successful login */
  readonly loginForm = this.fb.nonNullable.group({
    email: ['fake@email.com', [Validators.required, Validators.email]],
    password: ['fakePassword', Validators.required],
  });

  protected login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.toastService.show({
        type: 'error',
        title: 'Error',
        message: 'Please fill in all required fields correctly.',
      });
      return;
    }

    const { email, password } = this.loginForm.getRawValue();

    this.authService.login(email, password).subscribe({
      next: () => void this.router.navigateByUrl('tasks'),
      error: (e) => this.onLoginError(e),
    });
  }

  private onLoginError(error: HttpErrorResponse): void {
    const isUnauthorized = error.status === HttpStatusCode.Unauthorized;

    this.toastService.show({
      type: 'error',
      title: 'Error',
      message: isUnauthorized
        ? 'Invalid email or password.'
        : 'An error occurred during login.',
    });
  }
}
