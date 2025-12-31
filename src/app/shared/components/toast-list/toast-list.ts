import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';

import { CustomButton } from '@shared/directives/custom-button/custom-button';
import { Toast } from '@shared/models/toast-config.model';
import { ToastService } from '@shared/services/toast-service';

import { ToastWithClass } from './models/toast-class.model';
import { TOAST_TYPE_CLASS } from './tokens/toast-class.token';

@Component({
  selector: 'app-toast-list',
  imports: [CommonModule, CustomButton],
  templateUrl: './toast-list.html',
})
export class ToastList {
  private readonly toastService = inject(ToastService);
  private readonly toastTypeClass = inject(TOAST_TYPE_CLASS);

  protected readonly toasts = computed(() => {
    const toasts = this.toastService.toasts();
    return toasts.map((toast) => this.addClassIntoToastConfig(toast));
  });

  private addClassIntoToastConfig(toast: Toast): ToastWithClass {
    return {
      ...toast,
      class: this.toastTypeClass[toast.type],
    };
  }

  removeToast(toastId: string): void {
    this.toastService.removeToast(toastId);
  }
}
