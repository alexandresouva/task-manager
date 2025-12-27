import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { TestHelper } from '@testing/helpers/test-helper';

import { ButtonBaseDirective } from './button-base';

function setup() {
  @Component({
    standalone: true,
    imports: [ButtonBaseDirective],
    template: `
      <button appButtonBase data-testid="default-button" type="button">
        Default Button
      </button>
    `,
  })
  class TestHostComponent {}

  TestBed.configureTestingModule({
    imports: [TestHostComponent],
  });

  const fixture = TestBed.createComponent(TestHostComponent);
  const testHelper = new TestHelper(fixture);
  fixture.detectChanges();

  return { fixture, testHelper };
}

describe('ButtonSize Directive', () => {
  it('should add base class to the host element', () => {
    const { testHelper } = setup();

    const buttonDebugElement = testHelper.queryByTestId('default-button');
    const button: HTMLButtonElement = buttonDebugElement.nativeElement;

    expect(button.classList.contains('btn')).toBe(true);
  });
});
