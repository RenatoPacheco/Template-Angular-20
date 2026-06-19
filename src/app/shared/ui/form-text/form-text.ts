import { Component, computed, Input, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { transformBoolean } from '@app/shared/utils';
import { FormBase } from '@app/shared/directives';

import { Label } from '../label/label';
import { Button } from '../button/button';
import { CnpjPipe, CpfPipe, DatePipe, DateTimePipe, TimePipe } from '@app/shared/pipes';

type InputType = 'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url';
type InputAutocomplete =
    | 'on'
    | 'off'
    | 'name'
    | 'given-name'
    | 'additional-name'
    | 'family-name'
    | 'nickname'
    | 'username'
    | 'new-password'
    | 'current-password'
    | 'email'
    | 'tel'
    | 'tel-country-code'
    | 'tel-national'
    | 'tel-area-code'
    | 'tel-local'
    | 'tel-extension'
    | 'street-address'
    | 'address-line1'
    | 'address-line2'
    | 'address-line3'
    | 'address-level1'
    | 'address-level2'
    | 'address-level3'
    | 'address-level4'
    | 'country'
    | 'country-name'
    | 'postal-code'
    | 'organization'
    | 'organization-title'
    | 'bday'
    | 'bday-day'
    | 'bday-month'
    | 'bday-year'
    | 'cc-name'
    | 'cc-number'
    | 'cc-exp'
    | 'cc-exp-month'
    | 'cc-exp-year'
    | 'cc-csc'
    | 'cc-type'
    | 'url'
    | 'photo'
    | 'sex'
    | 'language';

  type InputTransform = 'cpf' | 'cnpj' | 'date' | 'datetime' | 'time';

@Component({
  standalone: true,
  selector: 'app-form-text',
  imports: [ Label, FormsModule, Button ],
  templateUrl: './form-text.html',
  styleUrl: './form-text.scss',
  host: {
    '[class]': 'hostClass()'
  }
})
export class FormText extends FormBase<string>  {
  
  constructor() {
    super();
  }

  protected readonly _transform = signal<InputTransform|null>(null);
  @Input() public set transform(value: InputTransform|null) {
    if (value !== this.transform) {
      this._transform.set(value);
    }
  }
  public get transform(): InputTransform|null {
    return this._transform();
  }
  
  protected readonly _type = signal<InputType>('text');
  @Input() public set type(value: InputType) {
    if (value !== this.type) {
      this._type.set(value);
    }
  }
  public get type(): InputType {
    return this._type();
  }
  
  protected readonly _placeholder = signal('');
  @Input() public set placeholder(value: string) {
    if (value !== this.placeholder) {
      this._placeholder.set(value);
    }
  }
  public get placeholder(): string {
    return this._placeholder();
  }

  protected readonly _autocomplete = signal<InputAutocomplete>('off');
  @Input() public set autocomplete(value: InputAutocomplete) {
    if (value !== this.autocomplete) {
      this._autocomplete.set(value);
    }
  }
  public get autocomplete(): InputAutocomplete {
    return this._autocomplete();
  }

  protected readonly _controlSecret = signal(false);
  @Input({ alias: 'control-secret', transform: transformBoolean })
  public set controlSecret(value: boolean) {
    if (value !== this.controlSecret) {
      this._controlSecret.set(value);
    }
  }
  public get controlSecret(): boolean {
    return this._controlSecret();
  }

  protected readonly _secretHasBeenReversed = signal(false);
  protected onToggleSecret(): void {
    var currentValue = this._secretHasBeenReversed();
    this._secretHasBeenReversed.set(!currentValue);
    this.element?.nativeElement.focus()
  }

  protected showSecretComputed = computed(() => {
    const typeVal = this._type();
    const controlSecretVal = this._controlSecret();
    const secretHasBeenReversedVal = this._secretHasBeenReversed();
    
    let result = controlSecretVal && typeVal === 'password' 
    ? true : false;

    return secretHasBeenReversedVal ? !result : result;
  });

  protected hideSecretComputed = computed(() => {
    const typeVal = this._type();
    const controlSecretVal = this._controlSecret();
    const secretHasBeenReversedVal = this._secretHasBeenReversed();
    
    let result = controlSecretVal && typeVal !== 'password' 
    ? true : false;

    return secretHasBeenReversedVal ? !result : result;
  });

  protected typeComputed = computed(() => {
    let typeVal = this._type();
    const isPasswordType = typeVal === 'password';
    const controlSecretVal = this._controlSecret();
    const reverseSecretVal = this._secretHasBeenReversed();

    if (controlSecretVal && reverseSecretVal) {
      typeVal = isPasswordType ? 'text' : 'password';
    } else {
      switch (typeVal) {
        case 'search':
          typeVal = 'text';
          break;
      }
    }

    return typeVal;
  });

  protected hostClass = computed(() => {
    const classVal = this._class();
    return `form-group mb-3 ${classVal}`;
  });

  protected elementClass = computed(() => {
    const sizeVal = this._size();
    return `form-control form-control-${sizeVal}`;
  });

  protected override onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input?.value as string | null;

    switch (this.transform) {
      case 'cpf':
        value = CpfPipe.apply(value);
        break;
      case 'cnpj':
        value = CnpjPipe.apply(value);
        break;
      case 'date':
        value = DatePipe.apply(value);
        break;
      case 'datetime':
        value = DateTimePipe.apply(value);
        break;
      case 'time':
        value = TimePipe.apply(value);
        break;
    }

    input.value = value ?? '';
    super.onInput(event);
  }
}
