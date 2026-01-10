import { WritableSignal, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Toast, ToastType } from '@shared/models/toast.model';
import { ToastService } from '@shared/services/toast-service';
import { TestHelper } from '@testing/test-helper/test-helper';
import { MockService } from 'ng-mocks';

import { ToastList } from './toast-list';
import { TOAST_TYPE_CLASS } from './tokens/toast-class.token';

export const FAKE_TOAST_TYPE_CLASS: Record<ToastType, string> = {
  success: 'success',
  error: 'error',
  info: 'info',
  warning: 'warning',
};

async function setup(
  toastsSignal: WritableSignal<Toast[]> = signal<Toast[]>([]),
) {
  const toastServiceMock = MockService(ToastService, {
    toasts: toastsSignal.asReadonly(),
  });

  await TestBed.configureTestingModule({
    imports: [ToastList],
    providers: [
      { provide: ToastService, useValue: toastServiceMock },
      { provide: TOAST_TYPE_CLASS, useValue: FAKE_TOAST_TYPE_CLASS },
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(ToastList);
  const component = fixture.componentInstance;
  const testHelper = new TestHelper(fixture);
  fixture.detectChanges();

  return { component, fixture, testHelper, toastServiceMock };
}

describe('ToastList', () => {
  it('should create', async () => {
    const { component } = await setup();
    expect(component).toBeTruthy();
  });

  describe('when toasts change', () => {
    it('should render the new toast list with correct classes and titles', async () => {
      const toastSignal = signal<Toast[]>([]);
      const { fixture, testHelper } = await setup(toastSignal);
      const fakeToasts: Toast[] = [
        { type: 'success', title: 'Success message', id: '1' },
        { type: 'error', title: 'Error message', id: '2' },
      ];

      fixture.detectChanges();
      const initialToastsItems = testHelper.queries.queryAll('toast-list-item');
      expect(initialToastsItems.length).toBe(0);

      toastSignal.set(fakeToasts);
      fixture.detectChanges();

      const newToastsItems = testHelper.queries.queryAll('toast-list-item');
      const newToastItemsTitles =
        testHelper.queries.queryAll('toast-list-title');
      expect(newToastsItems.length).toBe(fakeToasts.length);

      for (const [index, toastItem] of newToastsItems.entries()) {
        const expectedToast = fakeToasts[index];
        const expectedClass = FAKE_TOAST_TYPE_CLASS[expectedToast.type];
        const toastTitle =
          newToastItemsTitles[index].nativeElement.textContent.trim();
        const classes = toastItem.nativeElement.classList;

        expect(classes).toContain(expectedClass);
        expect(toastTitle).toBe(expectedToast.title);
      }
    });

    it('should render the toast message when provided', async () => {
      const toastSignal = signal<Toast[]>([]);
      const { fixture, testHelper } = await setup(toastSignal);
      const fakeToast: Toast = {
        type: 'success',
        title: 'Success message',
        message: 'This is a success toast message.',
        id: '1',
      };

      toastSignal.set([fakeToast]);
      fixture.detectChanges();

      const toastMessage =
        testHelper.queries.getTextContent('toast-list-message');
      expect(toastMessage.trim()).toBe(fakeToast.message);
    });

    it('should remove the toast item when the close button is clicked', async () => {
      const toastSignal = signal<Toast[]>([]);
      const { fixture, testHelper } = await setup(toastSignal);
      const fakeToast: Toast = {
        type: 'success',
        title: 'Success message',
        id: '1',
      };

      toastSignal.set([fakeToast]);
      fixture.detectChanges();

      testHelper.trigger.click('toast-list-close-button');
      toastSignal.set([]);
      fixture.detectChanges();
      const toastItems = testHelper.queries.queryAll('toast-list-item');

      expect(toastItems.length).toBe(0);
    });
  });
});
