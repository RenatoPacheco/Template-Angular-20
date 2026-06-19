import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import { TimePipe } from '../pipes';

@Directive({
  selector: '[time-transform]',
  standalone: true
})
export class TimeTransform {

  private readonly reference = inject(ElementRef<HTMLInputElement>);

  @HostListener('input')
  onInput(): void {

    const element = this.reference.nativeElement;
    element.value = TimePipe.apply(element.value);
  }
}