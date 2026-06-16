import { Component, computed, Input, signal, untracked } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { FormBase } from "@app/shared/directives";
import { transformBoolean } from "@app/shared/utils";

@Component({
  standalone: true,
  selector: 'app-form-check',
  imports: [ FormsModule ],
  templateUrl: './form-check.html',
  styleUrl: './form-check.scss',
  host: {
    '[class]': 'hostClass()'
  }
})
export class FormCheck extends FormBase<string>  {

  constructor()  {
    super();
  }

  protected readonly _type = signal<'radio'|'checkbox'>('checkbox');
  @Input({ required: true })
  public set type(value: 'radio'|'checkbox') {
    if (value !== this.type) {
      this._type.set(value);
    }
  }
  public get type(): string {
    return untracked(() => this._type());
  }

  protected readonly _theme = signal<'switch'|''>('');
  @Input()
  public set theme(value: 'switch') {
    if (value !== this.theme) {
      this._theme.set(value);
    }
  }
  public get theme(): 'switch'|'' {
    return untracked(() => this._theme());
  }

  protected readonly _inline = signal(false);
  @Input({ transform: transformBoolean })
  public set inline(value: boolean) {
    if (value !== this.inline) {
      this._inline.set(value);
    }
  }
  public get inline(): boolean {
    return untracked(() => this._inline());
  }

  protected readonly _name = signal('');
  @Input()
  public set name(value: string) {
    if (value !== this.name) {
      this._name.set(value);
    }
  }
  public get name(): string {
    return untracked(() => this._name());
  }

  protected hostClass = computed(() => {
    const classVal = this._class();
    const themeVal = this._theme();
    const inlineVal = this._inline();
    const parts = ['form-check'];

    if (themeVal === 'switch') {
      parts.push(' form-switch');
    }

    if (inlineVal) {
      parts.push(' form-check-inline');
    }

    if (classVal) {
      parts.push(` ${classVal}`);
    }

    return parts.join('');
  });

  protected elementClass = computed(() => {
    return `form-check-input`;
  });

  protected labelClass = computed(() => {
    return `form-check-label`;
  });

}