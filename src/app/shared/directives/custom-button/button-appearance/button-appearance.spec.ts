import { Component, input } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { TestHelper } from '@testing/helpers/test-helper';

import { ButtonAppearanceDirective } from './button-appearance';
import { CustomButtonAppearance } from './button-appearance.model';

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
        data-testid="custom-type-button"
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
    it('should change host element class', () => {
      const { testHelper, fixture } = setup();

      const buttonDebugElement = testHelper.queryByTestId('custom-type-button');
      const button: HTMLButtonElement = buttonDebugElement.nativeElement;

      fixture.componentRef.setInput('appearance', 'secondary');
      fixture.detectChanges();

      expect(button.classList.contains('btn-primary')).toBe(false);
      expect(button.classList.contains('btn-secondary')).toBe(true);

      fixture.componentRef.setInput('appearance', 'tertiary');
      fixture.detectChanges();

      expect(button.classList.contains('btn-secondary')).toBe(false);
      expect(button.classList.contains('btn-tertiary')).toBe(true);
    });
  });
});
