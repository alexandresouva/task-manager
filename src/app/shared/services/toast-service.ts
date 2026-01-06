import { Injectable, signal } from '@angular/core';

import { Toast, ToastConfig } from '@shared/models/toast.model';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly _toasts = signal<Toast[]>([]);
  readonly toasts = this._toasts.asReadonly();

  private readonly defaultDuration = 3000;
  private readonly autoDismissTimeouts = new Map<string, number>();

  show(config: ToastConfig): void {
    const toast = this.createToast(config);
    this.enqueueToastForDisplay(toast);
  }

  remove(id: string): void {
    const timeoutId = this.autoDismissTimeouts.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.autoDismissTimeouts.delete(id);
    }
    this._toasts.update((toasts) => toasts.filter((t) => t.id !== id));
  }

  private enqueueToastForDisplay(toast: Toast): void {
    this._toasts.update((toasts) => [...toasts, toast]);

    const duration = toast.duration ?? this.defaultDuration;
    const timeoutId = setTimeout(() => this.remove(toast.id), duration);
    this.autoDismissTimeouts.set(toast.id, timeoutId);
  }

  private createToast(toast: ToastConfig): Toast {
    return { ...toast, id: crypto.randomUUID() };
  }
}
