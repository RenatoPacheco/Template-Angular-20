import { Directive, ElementRef, HostListener, inject } from '@angular/core';

import { DatePipe } from '../pipes';
import { InputElementUtils } from '../utils';

@Directive({
  selector: '[date-transform]',
  standalone: true
})
export class DateTransform {

  private readonly reference = inject(ElementRef<HTMLInputElement>);

  @HostListener('input')
    onInput(): void {
      const element = this.reference.nativeElement;
      DateTransform.apply(element);
    }
  
    public static apply(element: HTMLInputElement): void {
      const newValue = DatePipe.apply(element.value) ?? '';
      const position = InputElementUtils.getToHoldPosition(element, newValue);
      
      element.value = newValue;
      element.setSelectionRange(position.start, position.end);
    }
}