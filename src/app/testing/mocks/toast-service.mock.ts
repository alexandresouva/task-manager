import { WritableSignal, signal } from '@angular/core';

import { Toast } from '@shared/models/toast-config.model';
import { ToastService } from '@shared/services/toast-service';

export const createToastServiceMock = (
  toastsSignal: WritableSignal<Toast[]> = signal<Toast[]>([]),
): Partial<ToastService> => ({
  show: jest.fn(),
  toasts: toastsSignal.asReadonly(),
  removeToast: jest.fn(),
});
