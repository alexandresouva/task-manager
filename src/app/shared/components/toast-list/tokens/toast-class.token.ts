import { InjectionToken } from '@angular/core';

import { ToastType } from '@shared/models/toast-config.model';

import { TOAST_TYPE_CLASS_MAP } from '../constants/toast-type-class';

export const TOAST_TYPE_CLASS = new InjectionToken<Record<ToastType, string>>(
  'Mapping from toast type to Tailwind classes',
  {
    providedIn: 'root',
    factory: (): Record<ToastType, string> => TOAST_TYPE_CLASS_MAP,
  },
);
