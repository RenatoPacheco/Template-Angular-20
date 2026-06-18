import { Component, Input, signal, untracked } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { FormCheckBase } from '@app/shared/directives';

@Component({
  standalone: true,
  selector: 'app-form-radio',
  imports: [ FormsModule ],
  templateUrl: './form-radio.html',
  styleUrl: './form-radio.scss',
  host: {
    'class' : 'form-check',
    '[class.form-check-inline]': '_inline()',
    '[class.form-switch]': '_switch()'
  }
})
export class FormRadio extends FormCheckBase  {

  constructor()  {
    super();
  }

  protected readonly _group = signal('');
  @Input({ required: true }) 
  public set group(value: string) {
    if (value !== this.group) {
      this._group.set(value);
    }
  }
  public get group(): string {
    return this._group();
  }
}