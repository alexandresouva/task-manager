export type ToastType = 'success' | 'error' | 'info' | 'warning';

export type ToastConfig = {
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
};

export type Toast = ToastConfig & {
  id: string;
};
