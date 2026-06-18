import { Component, computed, Input, signal, untracked } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { transformNumber } from '@app/shared/utils';

import { Button } from '../button/button';
import { Label } from '../label/label';
import { FormBase } from '@app/shared/directives';

@Component({
  standalone: true,
  selector: 'app-form-textarea',
  imports: [ Label, FormsModule, Button ],
  templateUrl: './form-textarea.html',
  styleUrl: './form-textarea.scss',
  host: {
    '[class]': 'hostClass()'
  }
})
export class FormTextarea extends FormBase<string>  {
  
  constructor() {
    super();
  }
  
  protected readonly _placeholder = signal('');
  @Input()
  public set placeholder(value: string) {
    if (value !== this.placeholder) {
      this._placeholder.set(value);
    }
  }
  public get placeholder(): string {
    return untracked(() => this._placeholder());
  }

  public _rows = signal(5);
  @Input({ transform: transformNumber })
  public set rows(value: number) {
    if (value !== this.rows) {
      this._rows.set(value);
    }
  }
  public get rows(): number {
    return untracked(() => this._rows());
  }
  
  protected hostClass = computed(() => {
    const classVal = this._class();
    return `form-group mb-3 ${classVal}`;
  });

  protected elementClass = computed(() => {
    const sizeVal = this._size();
    return `form-control form-control-${sizeVal}`;
  });
}
