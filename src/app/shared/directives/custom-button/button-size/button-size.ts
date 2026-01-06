import { Directive, inject, ElementRef, input, effect } from '@angular/core';

import { BUTTON_SIZE_CLASS_MAP } from './button-size.config';
import { CustomButtonSize } from '../custom-button.model';

@Directive({
  selector: '[appButtonSize]',
  standalone: true,
})
export class ButtonSizeDirective {
  private readonly el: ElementRef<HTMLElement> = inject(ElementRef);

  private readonly defaultSize: CustomButtonSize = 'md';
  readonly size = input<CustomButtonSize>(this.defaultSize);

  constructor() {
    effect(() => {
      const size = this.size();

      this.reset();

      const sizeClass =
        BUTTON_SIZE_CLASS_MAP[size] ?? BUTTON_SIZE_CLASS_MAP[this.defaultSize];
      this.el.nativeElement.classList.add(sizeClass);
    });
  }

  private reset(): void {
    const classes = Object.values(BUTTON_SIZE_CLASS_MAP);
    this.el.nativeElement.classList.remove(...classes);
  }
}
