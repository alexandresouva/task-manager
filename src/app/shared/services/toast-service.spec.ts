import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ToastService } from './toast-service';
import { Toast, ToastConfig } from '../models/toast.model';

function setup() {
  TestBed.configureTestingModule({
    providers: [ToastService],
  });

  const service = TestBed.inject(ToastService);

  return { service };
}

describe('ToastService', () => {
  it('should be created', () => {
    const { service } = setup();
    expect(service).toBeTruthy();
  });

  it('should add a new item to the toasts array', () => {
    const { service } = setup();
    const fakeToastConfig: ToastConfig = {
      type: 'success',
      title: 'Test Toast',
    };
    const fakeToast: Toast = {
      ...fakeToastConfig,
      id: 'mock-id-1',
    };

    const initialToasts = service['toasts']();
    jest
      .spyOn(globalThis.crypto, 'randomUUID')
      .mockReturnValue(
        fakeToast.id as `${string}-${string}-${string}-${string}-${string}`,
      );
    service.show(fakeToast);
    const updatedToasts = service['toasts']();

    expect(updatedToasts.length).toBe(initialToasts.length + 1);
    expect(updatedToasts).toContainEqual(fakeToast);
  });

  it('should remove an item from the toasts array after default duration', fakeAsync(() => {
    const { service } = setup();
    const fakeToastConfig: ToastConfig = {
      type: 'error',
      title: 'Error Toast',
    };
    const fakeToast: Toast = {
      ...fakeToastConfig,
      id: 'mock-id-2',
    };

    jest
      .spyOn(globalThis.crypto, 'randomUUID')
      .mockReturnValue(
        fakeToast.id as `${string}-${string}-${string}-${string}-${string}`,
      );
    service.show(fakeToastConfig);

    expect(service['toasts']()).toContainEqual(fakeToast);
    tick(1000);
    expect(service['toasts']()).toContainEqual(fakeToast);
    tick(2000);
    expect(service['toasts']()).not.toContainEqual(fakeToast);
  }));

  it('should remove an item from the toasts array after the specified duration', fakeAsync(() => {
    const { service } = setup();
    const fakeToastConfig: ToastConfig = {
      type: 'error',
      title: 'Error Toast',
      duration: 1000,
    };
    const fakeToast: Toast = {
      ...fakeToastConfig,
      id: 'mock-id-3',
    };

    jest
      .spyOn(globalThis.crypto, 'randomUUID')
      .mockReturnValue(
        fakeToast.id as `${string}-${string}-${string}-${string}-${string}`,
      );
    service.show(fakeToastConfig);

    expect(service['toasts']()).toContainEqual(fakeToast);
    tick(1000);
    expect(service['toasts']()).not.toContainEqual(fakeToast);
  }));

  it('should remove a toast and clear the timeout when removeToast is called', () => {
    const { service } = setup();
    const fakeToastConfig: ToastConfig = { type: 'info', title: 'Info Toast' };

    service.show(fakeToastConfig);
    const fakeToast = service.toasts()[0];
    expect(service.toasts()).toContain(fakeToast);

    service.remove(fakeToast.id);
    expect(service.toasts()).not.toContain(fakeToast);
  });

  it('should not remove toast if the toast id is not found', fakeAsync(() => {
    const { service } = setup();
    const fakeToastConfig: ToastConfig = { type: 'info', title: 'Info Toast' };
    const fakeToast: Toast = {
      ...fakeToastConfig,
      id: 'mock-id-4',
    };

    jest
      .spyOn(globalThis.crypto, 'randomUUID')
      .mockReturnValue(
        fakeToast.id as `${string}-${string}-${string}-${string}-${string}`,
      );

    service.show(fakeToastConfig);
    service.remove('invalid-id');
    tick();
    expect(service['toasts']()).toContainEqual(fakeToast);
  }));
});
