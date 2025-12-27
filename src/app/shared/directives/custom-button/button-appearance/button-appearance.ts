import { Directive, inject, ElementRef, input, effect } from '@angular/core';

import { BUTTON_APPEARANCE_CLASS } from './button-appearance.config';
import { CustomButtonAppearance } from '../custom-button.model';

@Directive({
  selector: '[appButtonAppearance]',
  standalone: true,
})
export class ButtonAppearanceDirective {
  private readonly el = inject(ElementRef);

  readonly appearance = input<CustomButtonAppearance>('primary');

  constructor() {
    effect(() => {
      const appearance = this.appearance();

      this.reset();

      const appearanceClass =
        BUTTON_APPEARANCE_CLASS[appearance] ?? BUTTON_APPEARANCE_CLASS.primary;
      this.el.nativeElement.classList.add(appearanceClass);
    });
  }

  private reset(): void {
    const classes = Object.values(BUTTON_APPEARANCE_CLASS);
    this.el.nativeElement.classList.remove(...classes);
  }
}
