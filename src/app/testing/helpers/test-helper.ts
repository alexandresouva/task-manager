import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

export class TestHelper<T> {
  constructor(private readonly fixture: ComponentFixture<T>) {}

  queryByTestId(testId: string): DebugElement | null {
    return this.fixture.debugElement.query(By.css(`[data-testid="${testId}"]`));
  }

  queryAllByTestId(testId: string): DebugElement[] {
    return this.fixture.debugElement.queryAll(
      By.css(`[data-testid="${testId}"]`),
    );
  }

  getTextContentByTestId(testId: string): string | null {
    return this.queryByTestId(testId).nativeElement.textContent.trim();
  }

  getComponentInstanceByTestId<T>(testId: string): T | null {
    return this.queryByTestId(testId).componentInstance;
  }

  getValueByTestId(testId: string): string | null {
    return this.queryByTestId(testId).nativeElement.value;
  }

  getCheckedByTestId(testId: string): boolean | null {
    return this.queryByTestId(testId).nativeElement.checked;
  }

  triggerClickByTestId(testId: string): void {
    const element = this.queryByTestId(testId);
    element.triggerEventHandler('click', null);
  }

  triggerInputByTestId(testId: string, value: unknown): void {
    const element = this.queryByTestId(testId);
    element.triggerEventHandler('input', { target: { value } });
  }

  triggerCheckboxChangeByTestId(testId: string, checked: boolean): void {
    const element = this.queryByTestId(testId);
    element.triggerEventHandler('change', { target: { checked } });
  }

  triggerFormSubmitByTestId(testId: string, value: unknown): void {
    const element = this.queryByTestId(testId);
    element.triggerEventHandler('ngSubmit', value);
  }

  dispatchClickEventByTestId(testId: string): void {
    const el = this.queryByTestId(testId).nativeElement;
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    el.dispatchEvent(event);
  }

  dispatchClickEventAtCoordinates(x: number, y: number): void {
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      clientX: x,
      clientY: y,
    });
    document.dispatchEvent(event);
  }

  dispatchInputEventByTestId(testId: string, value: string): void {
    const el = this.queryByTestId(testId).nativeElement;
    el.value = value;

    const event = new InputEvent('input', { bubbles: true, cancelable: true });
    el.dispatchEvent(event);
  }

  dispatchCheckboxChangeByTestId(testId: string, checked: boolean): void {
    const el = this.queryByTestId(testId).nativeElement;
    el.checked = checked;

    const event = new Event('change', { bubbles: true, cancelable: true });
    el.dispatchEvent(event);
  }

  dispatchSubmitEventByTestId(testId: string): void {
    const form = this.queryByTestId(testId).nativeElement;
    form.dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true }),
    );
  }

  dispatchClick;
}
