import { Directive, ElementRef, HostListener, inject } from '@angular/core';

import { CnpjPipe } from '../pipes';
import { InputElementUtils } from '../utils';

@Directive({
  selector: '[cnpjTransform]',
  standalone: true
})
export class CnpjTransform {

  private readonly reference = inject(ElementRef<HTMLInputElement>);

  @HostListener('input')
  onInput(): void {
    const element = this.reference.nativeElement;
    CnpjTransform.apply(element);
  }

  public static apply(element: HTMLInputElement): void {
    const newValue = CnpjPipe.apply(element.value) ?? '';
    const position = InputElementUtils.getToHoldPosition(element, newValue);
    
    element.value = newValue;
    element.setSelectionRange(position.start, position.end);
  }

}