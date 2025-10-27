import { Toast } from '@shared/models/toast-config.model';

export type ToastWithClass = Toast & {
  class: string;
};
