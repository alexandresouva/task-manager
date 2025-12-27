import { Directive } from '@angular/core';

import { ButtonAppearanceDirective } from './button-appearance/button-appearance';
import { ButtonBaseDirective } from './button-base/button-base';
import { ButtonSizeDirective } from './button-size/button-size';

@Directive({
  selector: '[appCustomButton]',
  standalone: true,
  hostDirectives: [
    ButtonBaseDirective,
    {
      directive: ButtonAppearanceDirective,
      inputs: ['appearance'],
    },
    {
      directive: ButtonSizeDirective,
      inputs: ['size'],
    },
  ],
})
export class CustomButton {}
