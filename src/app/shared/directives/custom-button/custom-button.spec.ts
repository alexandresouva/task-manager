import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { TestHelper } from '@testing/helpers/test-helper';

import { CustomButton } from './custom-button';
import {
  CustomButtonAppearance,
  CustomButtonSize,
} from './custom-button.model';

function setup() {
  @Component({
    standalone: true,
    imports: [CustomButton],
    template: `
      <button
        appCustomButton
        data-testid="button"
        type="button"
        [appearance]="appearance"
        [size]="size"
      >
        Button
      </button>
    `,
  })
  class TestHostComponent {
    appearance: CustomButtonAppearance = 'primary';
    size: CustomButtonSize = 'md';
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
  it('should render with default appearance and size', () => {
    const { testHelper } = setup();

    const button = testHelper.queryByTestId('button').nativeElement;

    expect(button.classList.contains('btn')).toBe(true);
    expect(button.classList.contains('btn-primary')).toBe(true);
    expect(button.classList.contains('btn-md')).toBe(true);
  });

  it('should update classes when appearance and size change', () => {
    const { fixture, testHelper } = setup();

    const button = testHelper.queryByTestId('button').nativeElement;
    const hostComponent = fixture.componentInstance;

    hostComponent.appearance = 'secondary';
    hostComponent.size = 'lg';
    fixture.detectChanges();

    expect(button.classList.contains('btn-primary')).toBe(false);
    expect(button.classList.contains('btn-md')).toBe(false);

    expect(button.classList.contains('btn-secondary')).toBe(true);
    expect(button.classList.contains('btn-lg')).toBe(true);
  });
});
