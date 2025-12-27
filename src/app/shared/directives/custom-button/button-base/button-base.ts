import { Directive, inject, ElementRef } from '@angular/core';

@Directive({
  selector: '[appButtonBase]',
  standalone: true,
})
export class ButtonBaseDirective {
  private readonly el: ElementRef<HTMLElement> = inject(ElementRef);

  constructor() {
    this.el.nativeElement.classList.add('btn');
  }
}
