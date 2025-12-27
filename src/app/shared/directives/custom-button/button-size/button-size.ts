import { Directive, inject, ElementRef, input, effect } from '@angular/core';

import { CUSTOM_BUTTON_SIZES, CustomButtonSize } from './button-size.model';

@Directive({
  selector: '[appButtonSize]',
  standalone: true,
})
export class ButtonSizeDirective {
  private readonly el: ElementRef<HTMLElement> = inject(ElementRef);

  readonly size = input<CustomButtonSize>('md');

  constructor() {
    effect(() => {
      this.reset();
      this.el.nativeElement.classList.add(`btn-${this.size()}`);
    });
  }

  private reset(): void {
    const classes = CUSTOM_BUTTON_SIZES.map((size) =>
      this.buildButtonClass(size),
    );
    this.el.nativeElement.classList.remove(...classes);
  }

  private buildButtonClass(size: CustomButtonSize): string {
    return `btn-${size}`;
  }
}
