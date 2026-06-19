import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import { DateTimePipe } from '../pipes';

@Directive({
  selector: '[datetime-transform]',
  standalone: true
})
export class DateTimeTransform {

  private readonly reference = inject(ElementRef<HTMLInputElement>);

  @HostListener('input')
  onInput(): void {

    const element = this.reference.nativeElement;
    element.value = DateTimePipe.apply(element.value);
  }
}