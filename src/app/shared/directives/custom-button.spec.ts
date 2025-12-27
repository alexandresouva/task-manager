import { Component, input } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { TestHelper } from '@testing/helpers/test-helper';

import { CustomButton } from './custom-button';
import { CustomButtonType } from './custom-button.model';

function setup() {
  @Component({
    standalone: true,
    imports: [CustomButton],
    template: `
      <button appCustomButton data-testid="default-button" type="button">
        Default Button
      </button>

      <button
        appCustomButton
        data-testid="custom-type-button"
        type="button"
        [buttonType]="buttonType()"
      >
        Custom Button
      </button>
    `,
  })
  class TestHostComponent {
    readonly buttonType = input<CustomButtonType>('primary');
  }

  TestBed.configureTestingModule({
    imports: [TestHostComponent],
  });

  const fixture = TestBed.createComponent(TestHostComponent);
  const testHelper = new TestHelper(fixture);
  fixture.detectChanges();

  return { fixture, testHelper };
}

describe('CustomButton Directive', () => {
  describe('when no buttonType is provided', () => {
    it('should add default classes to the host element', () => {
      const { testHelper } = setup();

      const buttonDebugElement = testHelper.queryByTestId('default-button');
      const button: HTMLButtonElement = buttonDebugElement.nativeElement;

      expect(button.classList.contains('btn')).toBe(true);
      expect(button.classList.contains('btn-primary')).toBe(true);
    });
  });

  describe('when buttonType is provided', () => {
    it('should change host element class', () => {
      const { testHelper, fixture } = setup();

      const buttonDebugElement = testHelper.queryByTestId('custom-type-button');
      const button: HTMLButtonElement = buttonDebugElement.nativeElement;

      fixture.componentRef.setInput('buttonType', 'secondary');
      fixture.detectChanges();

      expect(button.classList.contains('btn-primary')).toBe(false);
      expect(button.classList.contains('btn-secondary')).toBe(true);

      fixture.componentRef.setInput('buttonType', 'tertiary');
      fixture.detectChanges();

      expect(button.classList.contains('btn-secondary')).toBe(false);
      expect(button.classList.contains('btn-tertiary')).toBe(true);
    });
  });
});
