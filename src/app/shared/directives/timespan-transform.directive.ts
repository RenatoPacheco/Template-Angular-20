import { Directive, ElementRef, HostListener, inject } from '@angular/core';

import { TimeSpanPipe } from '../pipes';
import { getAdjustedCursorPosition } from '../utils';

@Directive({
  selector: '[timespanTransform]',
  standalone: true
})
export class TimeSpanTransform {

  private readonly reference = inject(ElementRef<HTMLInputElement>);

  @HostListener('input')
  emitChange(): void {
    const element = this.reference.nativeElement;
    TimeSpanTransform.apply(element);
  }

  public static apply(element: HTMLInputElement): void {
    const newValue = TimeSpanPipe.apply(element.value) ?? '';
    const position = getAdjustedCursorPosition(element, newValue);
    
    element.value = newValue;
    element.setSelectionRange(position.start, position.end);
  }
}