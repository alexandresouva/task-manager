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

  triggerClickByTestId(testId: string): void {
    const element = this.queryByTestId(testId);
    element.triggerEventHandler('click', null);
  }
}
