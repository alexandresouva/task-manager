import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

export class QueryHelper<T> {
  private readonly root: DebugElement;

  constructor(fixture: ComponentFixture<T>) {
    this.root = fixture.debugElement;
  }

  query(testId: string, host: DebugElement = this.root): DebugElement | null {
    return host.query(By.css(`[data-testid="${testId}"]`));
  }

  queryAll(testId: string, host: DebugElement = this.root): DebugElement[] {
    return host.queryAll(By.css(`[data-testid="${testId}"]`));
  }

  getComponentInstance(
    testId: string,
    host: DebugElement = this.root,
  ): T | null {
    return this.query(testId, host).componentInstance;
  }

  getTextContent(
    testId: string,
    host: DebugElement = this.root,
  ): string | null {
    return this.query(testId, host).nativeElement.textContent.trim();
  }

  getValue(testId: string, host: DebugElement = this.root): string | null {
    return this.query(testId, host).nativeElement.value;
  }

  getChecked(testId: string, host: DebugElement = this.root): boolean | null {
    return this.query(testId, host).nativeElement.checked;
  }
}
