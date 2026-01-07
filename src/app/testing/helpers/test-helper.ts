import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

/**
 * Helper utility for Angular component tests.
 *
 * Provides two categories of interaction:
 *
 * - trigger*: Uses Angular DebugElement to invoke handlers directly
 *   (ideal for unit tests focused on component logic).
 *
 * - dispatch*: Dispatches real DOM events
 *   (required when browser behavior, event bubbling, or global listeners are involved).
 */
export class TestHelper<T> {
  constructor(private readonly fixture: ComponentFixture<T>) {}

  /** Queries a single element by data-testid */
  queryByTestId(testId: string): DebugElement | null {
    return this.fixture.debugElement.query(By.css(`[data-testid="${testId}"]`));
  }

  /** Queries all elements matching a data-testid */
  queryAllByTestId(testId: string): DebugElement[] {
    return this.fixture.debugElement.queryAll(
      By.css(`[data-testid="${testId}"]`),
    );
  }

  /** Returns trimmed textContent of an element */
  getTextContentByTestId(testId: string): string | null {
    return this.queryByTestId(testId).nativeElement.textContent.trim();
  }

  /** Returns the component instance associated with an element */
  getComponentInstanceByTestId<T>(testId: string): T | null {
    return this.queryByTestId(testId).componentInstance;
  }

  /** Returns input value */
  getValueByTestId(testId: string): string | null {
    return this.queryByTestId(testId).nativeElement.value;
  }

  /** Returns checkbox checked state */
  getCheckedByTestId(testId: string): boolean | null {
    return this.queryByTestId(testId).nativeElement.checked;
  }

  /**
   * Triggers a click handler via Angular DebugElement.
   * Fast, but does not bubble or trigger document listeners
   */
  triggerClickByTestId(testId: string): void {
    this.queryByTestId(testId).triggerEventHandler('click', null);
  }

  /**
   * Triggers an input event via Angular DebugElement.
   */
  triggerInputByTestId(testId: string, value: unknown): void {
    this.queryByTestId(testId).triggerEventHandler('input', {
      target: { value },
    });
  }

  /**
   * Triggers a checkbox change via Angular DebugElement.
   */
  triggerCheckboxChangeByTestId(testId: string, checked: boolean): void {
    this.queryByTestId(testId).triggerEventHandler('change', {
      target: { checked },
    });
  }

  /**
   * Triggers a form submit via Angular DebugElement.
   */
  triggerFormSubmitByTestId(testId: string): void {
    this.queryByTestId(testId).triggerEventHandler('submit', null);
  }

  /**
   * Dispatches a real click event on the DOM element.
   * Trigger bubbling  and document/window listeners, required for HostListeners.
   */
  dispatchClickEventByTestId(testId: string): void {
    const element = this.queryByTestId(testId).nativeElement;
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    element.dispatchEvent(event);
  }

  /**
   * Dispatches a real click event on DOM at specific screen coordinates.
   */
  dispatchClickEventAtCoordinates(x: number, y: number): void {
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      clientX: x,
      clientY: y,
    });
    document.dispatchEvent(event);
  }

  /**
   * Dispatches a real input event on a DOM element.
   */
  dispatchInputEventByTestId(testId: string, value: string): void {
    const el = this.queryByTestId(testId).nativeElement;
    el.value = value;
    const event = new InputEvent('input', { bubbles: true, cancelable: true });
    el.dispatchEvent(event);
  }

  /**
   * Dispatches a real real checkbox change event on DOM element.
   */
  dispatchCheckboxChangeByTestId(testId: string, checked: boolean): void {
    const el = this.queryByTestId(testId).nativeElement;
    el.checked = checked;
    const event = new Event('change', { bubbles: true, cancelable: true });
    el.dispatchEvent(event);
  }

  /**
   * Dispatches a native submit event on a form.
   */
  dispatchSubmitEventByTestId(testId: string): void {
    const form = this.queryByTestId(testId).nativeElement;
    form.dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true }),
    );
  }
}
