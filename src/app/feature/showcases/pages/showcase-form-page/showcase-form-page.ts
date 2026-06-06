import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FormInput } from '@app/shared/ui';

@Component({
  standalone: true,
  selector: 'app-showcase-form-page',
  imports: [FormsModule, ReactiveFormsModule, FormInput],
  templateUrl: './showcase-form-page.html',
  styleUrl: './showcase-form-page.scss',
})
export class ShowcaseFormPage implements OnInit {

  private formBuilder = inject(FormBuilder);

  protected form = this.formBuilder.group({
    inputText: this.formBuilder.control<string|null>(null),
    inputPassword: this.formBuilder.control<string|null>(null),
    inputEmail: this.formBuilder.control<string|null>(null),
    inputSearch: this.formBuilder.control<string|null>(null)
  });

  ngOnInit(): void {
    this.form.get('inputText')?.valueChanges.subscribe(value => {
      console.log('Form value changed:', value);
    });
  }

}
