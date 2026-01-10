import { DebugElement } from '@angular/core';

import { QueryHelper } from './query-helper';

export class DispatchHelper<T> {
  constructor(private readonly queries: QueryHelper<T>) {}

  click(testId: string, host?: DebugElement): void {
    const el = this.queries.query(testId, host).nativeElement;
    el.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    );
  }

  input(testId: string, value: string, host?: DebugElement): void {
    const el = this.queries.query(testId, host).nativeElement;
    el.value = value;

    el.dispatchEvent(
      new InputEvent('input', {
        bubbles: true,
        cancelable: true,
      }),
    );
  }

  checkboxChange(testId: string, checked: boolean, host?: DebugElement): void {
    const el = this.queries.query(testId, host).nativeElement;
    el.checked = checked;

    el.dispatchEvent(
      new Event('change', {
        bubbles: true,
        cancelable: true,
      }),
    );
  }

  submit(testId: string, host?: DebugElement): void {
    const el = this.queries.query(testId, host).nativeElement;
    el.dispatchEvent(
      new Event('submit', {
        bubbles: true,
        cancelable: true,
      }),
    );
  }

  clickAtCoordinates(x: number, y: number): void {
    document.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        clientX: x,
        clientY: y,
      }),
    );
  }
}
