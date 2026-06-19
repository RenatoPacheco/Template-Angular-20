import { Directive, ElementRef, HostListener, inject } from '@angular/core';

import { DateTimePipe } from '../pipes';
import { InputElementUtils } from '../utils';

@Directive({
  selector: '[datetimeTransform]',
  standalone: true
})
export class DateTimeTransform {

  private readonly reference = inject(ElementRef<HTMLInputElement>);

  @HostListener('input')
    onInput(): void {
      const element = this.reference.nativeElement;
      DateTimeTransform.apply(element);
    }
  
    public static apply(element: HTMLInputElement): void {
      const newValue = DateTimePipe.apply(element.value) ?? '';
      const position = InputElementUtils.getToHoldPosition(element, newValue);
      
      element.value = newValue;
      element.setSelectionRange(position.start, position.end);
    }
}