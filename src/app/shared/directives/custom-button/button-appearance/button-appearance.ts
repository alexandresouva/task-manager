import { Directive, inject, ElementRef, input, effect } from '@angular/core';

import {
  CUSTOM_BUTTON_APPEARANCES,
  CustomButtonAppearance,
} from './button-appearance.model';

@Directive({
  selector: '[appButtonAppearance]',
  standalone: true,
})
export class ButtonAppearanceDirective {
  private readonly el = inject(ElementRef);

  readonly appearance = input<CustomButtonAppearance>('primary');

  private readonly prefix = 'btn';

  constructor() {
    effect(() => {
      const appearance = this.appearance();

      this.reset();
      this.el.nativeElement.classList.add(`${this.prefix}-${appearance}`);
    });
  }

  private reset(): void {
    const classes = CUSTOM_BUTTON_APPEARANCES.map((appearance) =>
      this.buildButtonClass(appearance),
    );
    this.el.nativeElement.classList.remove(...classes);
  }

  private buildButtonClass(appearance: CustomButtonAppearance): string {
    return `btn-${appearance}`;
  }
}
