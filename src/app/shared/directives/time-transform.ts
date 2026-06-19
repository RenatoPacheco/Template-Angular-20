import { Directive, ElementRef, HostListener, inject } from '@angular/core';

import { TimePipe } from '../pipes';
import { InputElementUtils } from '../utils';

@Directive({
  selector: '[time-transform]',
  standalone: true
})
export class TimeTransform {

  private readonly reference = inject(ElementRef<HTMLInputElement>);

  @HostListener('input')
    onInput(): void {
      const element = this.reference.nativeElement;
      TimeTransform.apply(element);
    }
  
    public static apply(element: HTMLInputElement): void {
      const newValue = TimePipe.apply(element.value) ?? '';
      const position = InputElementUtils.getToHoldPosition(element, newValue);
      
      element.value = newValue;
      element.setSelectionRange(position.start, position.end);
    }
}