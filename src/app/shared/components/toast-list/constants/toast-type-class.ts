import { ToastType } from '@shared/models/toast-config.model';

export const TOAST_TYPE_CLASS_MAP: Record<ToastType, string> = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
  warning: 'bg-yellow-500',
};
