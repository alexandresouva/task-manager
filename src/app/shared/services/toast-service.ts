import { Injectable, signal } from '@angular/core';

import { Toast, ToastConfig } from '@shared/models/toast-config.model';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly _toasts = signal<Toast[]>([]);
  readonly toasts = this._toasts.asReadonly();

  private readonly defaultDuration = 3000;
  private readonly timeoutMap = new Map<string, number>();

  show(config: ToastConfig): void {
    const toast = this.generateToastWithId(config);

    this._toasts.update((toasts) => [...toasts, toast]);
    this.addToastInTimeoutQueue(toast);
  }

  removeToast(id: string): void {
    const timeoutId = this.timeoutMap.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.timeoutMap.delete(id);
    }

    this._toasts.update((toasts) => toasts.filter((t) => t.id !== id));
  }

  private addToastInTimeoutQueue(toast: Toast): void {
    const duration = toast.duration ?? this.defaultDuration;
    const timeoutId = setTimeout(() => this.removeToast(toast.id), duration);
    this.timeoutMap.set(toast.id, timeoutId);
  }

  private generateToastWithId(toast: ToastConfig): Toast {
    return { ...toast, id: crypto.randomUUID() };
  }
}
