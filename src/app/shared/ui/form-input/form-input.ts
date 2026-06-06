import { Component, computed, Input, signal, untracked } from '@angular/core';

import { Label } from '../label/label';

@Component({
  standalone: true,
  selector: 'app-form-input',
  imports: [ Label ],
  templateUrl: './form-input.html',
  styleUrl: './form-input.scss',
})
export class FormInput {

  private _id = signal(`${crypto.randomUUID()}`);
  @Input()
  public set id(value: string) {
    if (value !== this.id) {
      this._id.set(value);
    }
  }
  public get id(): string {
    return untracked(() => this._id());
  }

  private _helper = signal<(() => void) | null>(null);
  @Input()
  public set helper(value: (() => void) | null) {
    if (value !== this.helper) {
      this._helper.set(value || null);
    }
  }
  public get helper(): (() => void) | null {
    return untracked(() => this._helper());
  }

  private _error = signal<(() => void) | null>(null);
  @Input()
  public set error(value: (() => void) | null) {
    if (value !== this.error) {
      this._error.set(value || null);
    }
  }
  public get error(): (() => void) | null {
    return untracked(() => this._error());
  }

  private _label = signal('');
  @Input({ required: true })
  public set label(value: string) {
    if (value !== this.label) {
      this._label.set(value);
    }
  }
  public get label(): string {
    return untracked(() => this._label());
  }

  protected labelComputed = computed(() => {
    const labelVal = this._label();
    return labelVal ? labelVal : 'Label';
  });

  protected errorComputed = computed(() => {
    const errorVal = this._error();
    return errorVal ? errorVal : null;
  });

  protected helperComputed = computed(() => {
    const helperVal = this._helper();
    return helperVal ? helperVal : null;
  });

  protected idComputed = computed(() => {
    return this._id();
  });

}
