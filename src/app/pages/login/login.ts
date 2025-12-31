import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '@shared/services/auth-service';
import { ToastService } from '@shared/services/toast-service';
import { AuthStore } from '@shared/stores/auth-store';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly authStore = inject(AuthStore);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  /* Initialize with correct credentials to easily test successful login */
  readonly loginForm = this.fb.nonNullable.group({
    email: ['fake@email.com', [Validators.required, Validators.email]],
    password: ['fakePassword', [Validators.required, Validators.minLength(4)]],
  });

  protected login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.getRawValue();

    this.authService.login(email, password).subscribe({
      next: () => this.onLoginSuccess(),
      error: (e) => this.onLoginError(e),
    });
  }

  private onLoginSuccess(): void {
    this.authStore.isAuthenticated = true;
    this.router.navigateByUrl('tasks');
  }

  private onLoginError(error: HttpErrorResponse): void {
    const isUnauthorized = error.status === HttpStatusCode.Unauthorized;

    this.authStore.isAuthenticated = false;

    this.toastService.show({
      type: 'error',
      title: 'Error',
      message: isUnauthorized
        ? 'Invalid email or password.'
        : 'An error occurred during login. Please try again later.',
    });
  }
}
