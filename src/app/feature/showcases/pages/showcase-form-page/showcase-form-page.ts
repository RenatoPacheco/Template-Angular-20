import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { FormText, Button, FormCheckBox, FormRadio, FormEditor } from '@app/shared/ui';
import { FormTextarea } from '@app/shared/ui/form-textarea/form-textarea';
import { CustonValidators } from '@app/shared/validators';

@Component({
  standalone: true,
  selector: 'app-showcase-form-page',
  imports: [
    FormsModule, ReactiveFormsModule, FormText,
    FormTextarea, Button, FormCheckBox, FormRadio,
    FormEditor
],
  templateUrl: './showcase-form-page.html',
  styleUrl: './showcase-form-page.scss',
})
export class ShowcaseFormPage implements OnInit {

  private formBuilder = inject(FormBuilder);
  protected readonly destroyRef = inject(DestroyRef);

  public readonly formLogin = this.formBuilder.group({
    login: this.formBuilder.control<string|null>(null,{
      validators: [
        Validators.required,
        Validators.email,
      ], updateOn: 'blur'
    }),
    senha: this.formBuilder.control<string|null>(null,{
      validators: [
        Validators.required,
        CustonValidators.pasword(),
      ], updateOn: 'blur'
    })
  }); 

  protected opcoes = [
    { id: 'LER', descricao: 'Ler' },
    { id: 'ECREVER', descricao: 'Escrever' },
    { id: 'EXLUIR', descricao: 'Excluir' }
  ];

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
    textArea: this.formBuilder.control<string|null>(null),
    textEditor: this.formBuilder.control<string|null>(null,{
      validators: [
        Validators.minLength(300)
      ]
    }),
    checkbox: this.formBuilder.array<FormControl<string|null>>([]),
    radio: this.formBuilder.control<string|null>(null),
  });

  ngOnInit(): void {
    this.form.controls.checkbox.clear();
    this.opcoes.forEach(() => {
      this.form.controls.checkbox.push(
          this.formBuilder.control(null)
      );
  });

  this.form.patchValue({
    radio: this.opcoes[1].id
  });

  this.form.controls.inputText.valueChanges
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (value) => {
        return;
        console.log('value: ', value);
      }
    });

  this.form.valueChanges
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: () => {
        return;
        console.log('chechbox', this.form.value.checkbox?.filter(x => x !== null));
        console.log('radio', this.form.value.radio);
        console.log('textEditor', this.form.value.textEditor);
        console.log('inputText', this.form.value.inputText);
      }
    })
  }
}
