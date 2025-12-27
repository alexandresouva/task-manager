import { Component, input } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { TestHelper } from '@testing/helpers/test-helper';

import { ButtonSizeDirective } from './button-size';
import { CUSTOM_BUTTON_SIZES, CustomButtonSize } from './button-size.model';

function setup() {
  @Component({
    standalone: true,
    imports: [ButtonSizeDirective],
    template: `
      <button appButtonSize data-testid="default-button" type="button">
        Default Button
      </button>

      <button
        appButtonSize
        data-testid="custom-size-button"
        type="button"
        [size]="size()"
      >
        Custom Button
      </button>
    `,
  })
  class TestHostComponent {
    readonly size = input<CustomButtonSize>('md');
  }

  TestBed.configureTestingModule({
    imports: [TestHostComponent],
  });

  const fixture = TestBed.createComponent(TestHostComponent);
  const testHelper = new TestHelper(fixture);
  fixture.detectChanges();

  return { fixture, testHelper };
}

describe('ButtonSize Directive', () => {
  describe('when no size is provided', () => {
    it('should add default classes to the host element', () => {
      const { testHelper } = setup();

      const buttonDebugElement = testHelper.queryByTestId('default-button');
      const button: HTMLButtonElement = buttonDebugElement.nativeElement;

      expect(button.classList.contains('btn-md')).toBe(true);
    });
  });

  describe('when size is provided', () => {
    CUSTOM_BUTTON_SIZES.filter((size) => size !== 'md').forEach((size) => {
      it(`should apply ${size} size class`, () => {
        const { testHelper, fixture } = setup();

        const button =
          testHelper.queryByTestId('custom-size-button').nativeElement;

        fixture.componentRef.setInput('size', size);
        fixture.detectChanges();

        expect(button.classList.contains('btn-md')).toBe(false);
        expect(button.classList.contains(`btn-${size}`)).toBe(true);
      });
    });
  });
});
