import { Directive, ElementRef, HostListener, inject } from '@angular/core';

import { DatePipe } from '../pipes';
import { getAdjustedCursorPosition } from '../utils';

@Directive({
  selector: '[dateTransform]',
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
      const position = getAdjustedCursorPosition(element, newValue);
      
      element.value = newValue;
      element.setSelectionRange(position.start, position.end);
    }
}