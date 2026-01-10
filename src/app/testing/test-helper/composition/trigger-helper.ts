import { DebugElement } from '@angular/core';

import { QueryHelper } from './query-helper';

export class TriggerHelper<T> {
  constructor(private readonly queries: QueryHelper<T>) {}

  click(testId: string, host?: DebugElement): void {
    this.queries.query(testId, host).triggerEventHandler('click', null);
  }

  input(testId: string, value: unknown, host?: DebugElement): void {
    this.queries
      .query(testId, host)
      .triggerEventHandler('input', { target: { value } });
  }

  checkboxChange(testId: string, checked: boolean, host?: DebugElement): void {
    this.queries
      .query(testId, host)
      .triggerEventHandler('change', { target: { checked } });
  }

  submit(testId: string, host?: DebugElement): void {
    this.queries.query(testId, host).triggerEventHandler('submit', null);
  }
}
