import {
  Directive,
  ElementRef,
  HostListener,
  inject
} from '@angular/core';
import { CnpjPipe } from '../pipes';

@Directive({
  selector: '[cnpj-mask]',
  standalone: true
})
export class CnpjMask {

  private readonly reference = inject(ElementRef<HTMLInputElement>);
  private readonly transform = inject(CnpjPipe).transform;

  @HostListener('input')
  onInput(): void {

    const element = this.reference.nativeElement;
    element.value = this.transform(element.value);
  }
}