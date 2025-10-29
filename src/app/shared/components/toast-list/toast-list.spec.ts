import { WritableSignal, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Toast } from '@shared/models/toast-config.model';
import { ToastService } from '@shared/services/toast-service';
import { TestHelper } from '@testing/helpers/test-helper';
import { createToastServiceMock } from '@testing/mocks/toast-service.mock';
import { FAKE_TOAST_TYPE_CLASS } from '@testing/mocks/tokens/toast-class.token.mock';

import { ToastList } from './toast-list';
import { TOAST_TYPE_CLASS } from './tokens/toast-class.token';

async function setup(
  toastsSignal: WritableSignal<Toast[]> = signal<Toast[]>([]),
) {
  const toastServiceMock = createToastServiceMock(toastsSignal);
  const toastTypeClassMock = FAKE_TOAST_TYPE_CLASS;

  await TestBed.configureTestingModule({
    imports: [ToastList],
    providers: [
      { provide: ToastService, useValue: toastServiceMock },
      { provide: TOAST_TYPE_CLASS, useValue: toastTypeClassMock },
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(ToastList);
  const testHelper = new TestHelper(fixture);
  const component = fixture.componentInstance;
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
      const initialToastsItems = testHelper.queryAllByTestId('toast-list-item');
      expect(initialToastsItems.length).toBe(0);

      toastSignal.set(fakeToasts);
      fixture.detectChanges();

      const newToastsItems = testHelper.queryAllByTestId('toast-list-item');
      const newToastItemsTitles =
        testHelper.queryAllByTestId('toast-list-title');
      expect(newToastsItems.length).toBe(fakeToasts.length);

      newToastsItems.forEach((toastItem, index) => {
        const expectedToast = fakeToasts[index];
        const toastTitle =
          newToastItemsTitles[index].nativeElement.textContent.trim();

        const classes = toastItem.nativeElement.classList;

        expect(classes).toContain(expectedToast.type);
        expect(toastTitle).toBe(expectedToast.title);
      });
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

      testHelper.triggerClickByTestId('toast-list-close-button');
      toastSignal.set([]);
      fixture.detectChanges();
      const toastItems = testHelper.queryAllByTestId('toast-list-item');

      expect(toastItems.length).toBe(0);
    });
  });
});
