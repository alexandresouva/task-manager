import { ComponentFixture } from '@angular/core/testing';

import { DispatchHelper } from './composition/dispatch-helper';
import { QueryHelper } from './composition/query-helper';
import { TriggerHelper } from './composition/trigger-helper';

export class TestHelper<T> {
  readonly queries: QueryHelper<T>;
  readonly trigger: TriggerHelper<T>;
  readonly dispatch: DispatchHelper<T>;

  constructor(fixture: ComponentFixture<T>) {
    this.queries = new QueryHelper(fixture);
    this.trigger = new TriggerHelper(this.queries);
    this.dispatch = new DispatchHelper(this.queries);
  }
}
