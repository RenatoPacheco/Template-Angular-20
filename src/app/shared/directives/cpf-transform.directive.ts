import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import { CpfPipe } from '../pipes';
import { getAdjustedCursorPosition } from '../utils';

@Directive({
  selector: '[cpfTransform]',
  standalone: true
})
export class CpfTransform {

  private readonly reference = inject(ElementRef<HTMLInputElement>);

  @HostListener('input')
    onInput(): void {
      const element = this.reference.nativeElement;
      CpfTransform.apply(element);
    }
  
    public static apply(element: HTMLInputElement): void {
      const newValue = CpfPipe.apply(element.value) ?? '';
      const position = getAdjustedCursorPosition(element, newValue);
      
      element.value = newValue;
      element.setSelectionRange(position.start, position.end);
    }
}