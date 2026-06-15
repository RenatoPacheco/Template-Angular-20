import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { FormInput, Button } from '@app/shared/ui';
import { FormTextArea } from '@app/shared/ui/form-text-area/form-text-area';
import { CustonValidators } from '@app/shared/validators';

@Component({
  standalone: true,
  selector: 'app-showcase-form-page',
  imports: [
    FormsModule, ReactiveFormsModule, FormInput,
    FormTextArea, Button
],
  templateUrl: './showcase-form-page.html',
  styleUrl: './showcase-form-page.scss',
})
export class ShowcaseFormPage implements OnInit {

  private formBuilder = inject(FormBuilder);

  public readonly form = this.formBuilder.group({
    inputText: this.formBuilder.control<string|null>(null,{
      validators: [
        Validators.minLength(3),
        Validators.maxLength(100)
      ], updateOn: 'blur'
    }),
    inputPassword: this.formBuilder.control<string|null>(null,{
      validators: [
        Validators.required,
        CustonValidators.pasword()
      ], updateOn: 'blur'
    }),
    inputEmail: this.formBuilder.control<string|null>(null,{
      validators: [
        Validators.required,
        Validators.email,
        Validators.maxLength(300)
      ], updateOn: 'blur'
    }),
    inputSearch: this.formBuilder.control<string|null>(null),
    textArea: this.formBuilder.control<string|null>(null)
  });

  ngOnInit(): void {
    
  }

}
