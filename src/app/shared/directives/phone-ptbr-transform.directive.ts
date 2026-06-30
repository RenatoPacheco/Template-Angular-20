import { Directive, ElementRef, HostListener, inject } from '@angular/core';

import { PhonePtBrPipe } from '../pipes';
import { getAdjustedCursorPosition } from '../utils';

@Directive({
  selector: '[phonePtBrTransform]',
  standalone: true
})
export class PhonePtBrTransform {

  private readonly reference = inject(ElementRef<HTMLInputElement>);

  @HostListener('input')
  emitChange(): void {
    const element = this.reference.nativeElement;
    PhonePtBrTransform.apply(element);
  }

  public static apply(element: HTMLInputElement): void {
    const newValue = PhonePtBrPipe.apply(element.value) ?? '';
    const position = getAdjustedCursorPosition(element, newValue);
    
    element.value = newValue;
    element.setSelectionRange(position.start, position.end);
  }
}