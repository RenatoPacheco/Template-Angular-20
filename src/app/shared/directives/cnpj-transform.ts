import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import { CnpjPipe } from '../pipes';

@Directive({
  selector: '[cnpj-transform]',
  standalone: true
})
export class CnpjTransform {

  private readonly reference = inject(ElementRef<HTMLInputElement>);

  @HostListener('input')
  onInput(): void {

    const element = this.reference.nativeElement;
    element.value = CnpjPipe.apply(element.value);
  }
}