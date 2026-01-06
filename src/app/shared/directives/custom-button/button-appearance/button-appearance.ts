import { Directive, inject, ElementRef, input, effect } from '@angular/core';

import { BUTTON_APPEARANCE_CLASS_MAP } from './button-appearance.config';
import { CustomButtonAppearance } from '../custom-button.model';

@Directive({
  selector: '[appButtonAppearance]',
  standalone: true,
})
export class ButtonAppearanceDirective {
  private readonly el = inject(ElementRef);

  private readonly defaultAppearance: CustomButtonAppearance = 'primary';

  readonly appearance = input<CustomButtonAppearance>(this.defaultAppearance);

  constructor() {
    effect(() => {
      const appearance = this.appearance();

      this.reset();

      const appearanceClass =
        BUTTON_APPEARANCE_CLASS_MAP[appearance] ??
        BUTTON_APPEARANCE_CLASS_MAP[this.defaultAppearance];

      this.el.nativeElement.classList.add(appearanceClass);
    });
  }

  private reset(): void {
    const classes = Object.values(BUTTON_APPEARANCE_CLASS_MAP);
    this.el.nativeElement.classList.remove(...classes);
  }
}
