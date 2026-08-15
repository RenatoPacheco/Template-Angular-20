import { Component, computed, Input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { transformBoolean } from '@app/shared/utils';
import { CnpjTransform, CpfTransform, DateTimeTransform, DateTransform, 
  FormElementBase, PhonePtBrTransform, TimeSpanTransform } from '@app/shared/directives';

import { Label } from '../label/label';
import { Button } from '../button/button';

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

  type InputTransform = 'cpf' | 'cnpj' | 'date' | 'dateTime' | 'timeSpan' | 'phonePtBr';

@Component({
  standalone: true,
  selector: 'app-form-text',
  templateUrl: './form-text.html',
  styleUrl: './form-text.scss',
  imports: [ Label, FormsModule, Button ],
  host: {
    '[class]': 'hostClass()'
  }
})
export class FormText extends FormElementBase<string>  {
  
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
  protected emitToggleSecret(): void {
    var currentValue = this._secretHasBeenReversed();
    this._secretHasBeenReversed.set(!currentValue);
    this.element?.nativeElement.focus()
  }

  protected showSecret = computed(() => {
    const _type = this._type();
    const _controlSecret = this._controlSecret();
    const _secretHasBeenReversed = this._secretHasBeenReversed();
    
    let result = _controlSecret && _type === 'password' 
    ? true : false;

    return _secretHasBeenReversed ? !result : result;
  });

  protected hideSecret = computed(() => {
    const _type = this._type();
    const _controlSecret = this._controlSecret();
    const _secretHasBeenReversed = this._secretHasBeenReversed();
    
    let result = _controlSecret && _type !== 'password' 
    ? true : false;

    return _secretHasBeenReversed ? !result : result;
  });

  protected typeComputed = computed(() => {
    let _type = this._type();
    const isPasswordType = _type === 'password';
    const _controlSecret = this._controlSecret();
    const _reverseSecret = this._secretHasBeenReversed();

    if (_controlSecret && _reverseSecret) {
      _type = isPasswordType ? 'text' : 'password';
    } else {
      switch (_type) {
        case 'search':
          _type = 'text';
          break;
      }
    }

    return _type;
  });

  protected hostClass = computed(() => {
    const _class = this._class();
    return `form-group mb-3 ${_class}`;
  });

  protected elementClass = computed(() => {
    const _size = this._size();
    return `form-control form-control-${_size}`;
  });

  protected override emitChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input?.value ?? '';

    if (value) {
      switch (this.transform) {
        case 'cpf':
          CpfTransform.apply(input);
          break;
        case 'cnpj':
          CnpjTransform.apply(input);
          break;
        case 'date':
          DateTransform.apply(input);
          break;
        case 'dateTime':
          DateTimeTransform.apply(input);
          break;
        case 'timeSpan':
          TimeSpanTransform.apply(input);
          break;
        case 'phonePtBr':
          PhonePtBrTransform.apply(input);
          break;
      }
    }

    super.emitChange(event);
  }
}
