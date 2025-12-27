import { Component, input } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { TestHelper } from '@testing/helpers/test-helper';

import { ButtonAppearanceDirective } from './button-appearance';
import { CustomButtonAppearance } from '../custom-button.model';
import { BUTTON_APPEARANCE_CLASS } from './button-appearance.config';

function setup() {
  @Component({
    standalone: true,
    imports: [ButtonAppearanceDirective],
    template: `
      <button appButtonAppearance data-testid="default-button" type="button">
        Default Button
      </button>

      <button
        appButtonAppearance
        data-testid="custom-appearance-button"
        type="button"
        [appearance]="appearance()"
      >
        Custom Button
      </button>
    `,
  })
  class TestHostComponent {
    readonly appearance = input<CustomButtonAppearance>('primary');
  }

  TestBed.configureTestingModule({
    imports: [TestHostComponent],
  });

  const fixture = TestBed.createComponent(TestHostComponent);
  const testHelper = new TestHelper(fixture);
  fixture.detectChanges();

  return { fixture, testHelper };
}

describe('ButtonAppearance Directive', () => {
  describe('when no appearance is provided', () => {
    it('should add default classes to the host element', () => {
      const { testHelper } = setup();

      const buttonDebugElement = testHelper.queryByTestId('default-button');
      const button: HTMLButtonElement = buttonDebugElement.nativeElement;

      expect(button.classList.contains('btn-primary')).toBe(true);
    });
  });

  describe('when appearance is provided', () => {
    Object.keys(BUTTON_APPEARANCE_CLASS)
      .filter((appearance) => appearance !== 'primary')
      .forEach((appearance) => {
        it(`should apply ${appearance} appearance class`, () => {
          const { testHelper, fixture } = setup();
          const button = testHelper.queryByTestId(
            'custom-appearance-button',
          ).nativeElement;
          const expectedClass = BUTTON_APPEARANCE_CLASS[appearance];

          fixture.componentRef.setInput('appearance', appearance);
          fixture.detectChanges();

          expect(button.classList.contains('btn-primary')).toBe(false);
          expect(button.classList.contains(expectedClass)).toBe(true);
        });
      });

    it('should fallback to default appearance class for invalid appearance', () => {
      const { testHelper, fixture } = setup();
      const button = testHelper.queryByTestId(
        'custom-appearance-button',
      ).nativeElement;

      fixture.componentRef.setInput('appearance', 'invalid-appearance');
      fixture.detectChanges();

      expect(button.classList.contains('btn-primary')).toBe(true);
    });
  });
});
