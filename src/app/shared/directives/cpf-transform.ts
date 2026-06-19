import {
  Directive,
  ElementRef,
  HostListener,
  inject
} from '@angular/core';
import { CpfPipe } from '../pipes';

@Directive({
  selector: '[cpf-transform]',
  standalone: true
})
export class CpfTransform {

  private readonly reference = inject(ElementRef<HTMLInputElement>);

  @HostListener('input')
  onInput(): void {

    const element = this.reference.nativeElement;
    element.value = CpfPipe.apply(element.value);
  }
}