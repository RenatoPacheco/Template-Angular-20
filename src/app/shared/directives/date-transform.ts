import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import { DatePipe } from '../pipes';

@Directive({
  selector: '[date-transform]',
  standalone: true
})
export class DateTransform {

  private readonly reference = inject(ElementRef<HTMLInputElement>);

  @HostListener('input')
  onInput(): void {

    const element = this.reference.nativeElement;
    element.value = DatePipe.apply(element.value);
  }
}