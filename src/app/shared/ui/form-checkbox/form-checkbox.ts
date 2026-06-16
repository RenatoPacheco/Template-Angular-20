import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { FormCheckBase } from '@app/shared/directives';

@Component({
  standalone: true,
  selector: 'app-form-checkbox',
  imports: [ FormsModule ],
  templateUrl: './form-checkbox.html',
  styleUrl: './form-checkbox.scss',
  host: {
    'class' : 'form-check',
    '[class.form-check-inline]': '_inline()',
    '[class.form-switch]': '_switch()'
  }
})
export class FormCheckBox extends FormCheckBase  {

  constructor()  {
    super();
  }

}