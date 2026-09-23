import { Component, computed, Input, signal } from "@angular/core";

import { NgbDropdown, NgbDropdownMenu, NgbDropdownToggle } from "@ng-bootstrap/ng-bootstrap";

import { transformBoolean } from "@app/shared/utils";

import { Button, ButtonActionType, ButtonSizeType, ButtonThemeType } from "../button/button";

@Component({
  standalone: true,
  selector: 'app-button-dropdown',
  templateUrl: './button-dropdown.html',
  styleUrl: './button-dropdown.scss',
  host: {
    '[class]': 'hostClass()'
  },
  imports: [
    NgbDropdown, NgbDropdownToggle, 
    NgbDropdownMenu, Button
  ]
})
export class ButtonDropdown {

  protected _id = signal(`${crypto.randomUUID()}`);
  @Input() public set id(value: string) {
    if (value !== this.id) {
      this._id.set(value);
    }
  }
  public get id(): string {
    return this._id();
  }

  protected _class = signal('');
  @Input() public set class(value: string) {
    if (value !== this.class) {
      this._class.set(value);
    }
  }
  public get class(): string {
    return this._class();
  }

  protected _theme = signal<ButtonThemeType>('');
  @Input() public set theme(value: ButtonThemeType) {
    if (value !== this._theme()) {
      this._theme.set(value);
    }
  }
  public get theme(): ButtonThemeType {
    return this._theme();
  }

  protected _action = signal<ButtonActionType|null>('action');
  @Input() public set action(value: ButtonActionType|null) {
    if (value !== this._action()) {
      this._action.set(value || null);
    }
  }
  public get action(): ButtonActionType|null {
    return this._action();
  }

  protected _size = signal<ButtonSizeType>('md');
  @Input() public set size(value: ButtonSizeType) {
    if (value !== this._size()) {
      this._size.set(value);
    }
  }
  public get size(): ButtonSizeType {
    return this._size();
  }

  protected _disabled = signal(false);
  @Input({ transform: transformBoolean })
  public set disabled(value: boolean) {
    if (value !== this.disabled) {
      this._disabled.set(value);
    }
  }
  public get disabled(): boolean {
    return this._disabled();
  }

  protected _loading = signal(false);
  @Input({ transform: transformBoolean })
  public set loading(value: boolean) {
    if (value !== this.loading) {
      this._loading.set(value);
    }
  }
  public get loading(): boolean {
    return this._loading();
  }

  protected _text = signal('');
  @Input() public set text(value: string) {
    if (value !== this.text) {
      this._text.set(value);
    }
  }
  public get text(): string {
    return this._text();
  }

  protected _title = signal('');
  @Input() public set title(value: string) {
    if (value !== this.title) {
      this._title.set(value);
    }
  }
  public get title(): string {
    return this._title();
  }

  protected hostClass = computed(() => {
    const _class = this._class();
    return `${_class}`;
  }); 

}