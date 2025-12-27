import { Directive, effect, ElementRef, inject, input } from '@angular/core';

import { CUSTOM_BUTTON_TYPES, CustomButtonType } from './custom-button.model';

@Directive({
  selector: '[appCustomButton]',
  standalone: true,
})
export class CustomButton {
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);

  readonly buttonType = input<CustomButtonType>('primary');

  private readonly classPrefix = 'btn';

  constructor() {
    this.syncTypeClasses();
  }

  private syncTypeClasses(): void {
    effect(() => {
      const btnType = this.buttonType();

      this.resetClasses();
      this.elementRef.nativeElement.classList.add(
        this.classPrefix,
        this.buildButtonClass(btnType),
      );
    });
  }

  private buildButtonClass(type: CustomButtonType): string {
    return `${this.classPrefix}-${type}`;
  }

  private resetClasses(): void {
    const classes = CUSTOM_BUTTON_TYPES.map((type) =>
      this.buildButtonClass(type),
    );

    this.elementRef.nativeElement.classList.remove(...classes);
  }
}
