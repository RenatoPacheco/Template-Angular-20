import {
  Directive,
  ElementRef,
  HostListener,
  inject
} from '@angular/core';
import { CpfPipe } from '../pipes';

@Directive({
  selector: '[cpf-mask]',
  standalone: true
})
export class CpfMask {

  private readonly reference = inject(ElementRef<HTMLInputElement>);
  private readonly transform = inject(CpfPipe).transform;

  @HostListener('input')
  onInput(): void {

    const element = this.reference.nativeElement;
    element.value = this.transform(element.value);
  }
}