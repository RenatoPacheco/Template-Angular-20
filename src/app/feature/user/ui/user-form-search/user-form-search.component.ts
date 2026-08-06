import { Component, inject, Input, OnInit, output, Output, signal } from "@angular/core";
import { IUserFormSearchParams, IUserFormSearchData } from "./user-form-search.model";
import { UserFormSearchService } from "./user-form-search.service";
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Button, FormText, Label } from "@app/shared/ui";

import { User } from "../../data-access";

@Component({
  standalone: true,
  selector: 'app-user-form-search',
  templateUrl: './user-form-search.component.html',
  styleUrls: ['./user-form-search.component.scss'],
  imports: [FormsModule, ReactiveFormsModule, FormText, Button, Label]
})
export class UserFormSearchComponent implements OnInit {

  public ngOnInit(): void {
    if (!this.data) {
      this.formServ.resolve(this.params ?? {});
    }
  }

  private formServ = inject(UserFormSearchService);
  private formBuilder = inject(FormBuilder);

  public readonly onError = output<Error>();
  public readonly onEnable = output<void>();
  public readonly onDisable = output<void>();
  public readonly onSearch = output<User[]>();
  public readonly onSearching = output<boolean>();
  public readonly onData = output<IUserFormSearchData | null>();
  public readonly onParam = output<IUserFormSearchParams | null>();

  protected form = this.formBuilder.group({
    query: new FormControl<string|null>(null),
    status: new FormControl<string|null>(null)
  });

  protected _class = signal<string | null>(null);
  @Input() public set class(value: string | null) {
    if (value !== this.class) {
      this._class.set(value);
    }
  }
  public get class(): string | null {
    return this._class();
  }

  protected _id = signal<string | null>(crypto.randomUUID());
  @Input() public set id(value: string | null) {
    if (value !== this.id) {
      this._id.set(value);
    }
  }
  public get id(): string | null {
    return this._id();
  }

  protected _data = signal<IUserFormSearchData | null>(null);
  @Input() public get data(): IUserFormSearchData | null {
    return this._data();
  }
  public set data(value: IUserFormSearchData | null) {
    value = value ?? null;
    if (value !== this.data) {
      this._data.set(value);
      this.onData.emit(value);
    }
  }

  protected _params = signal<IUserFormSearchParams | null>(null);
  @Input() public get params(): IUserFormSearchParams | null {
    return this._params();
  }
  public set params(value: IUserFormSearchParams | null) {
    value = value ?? null;
    if (value !== this.params) {
      this._params.set(value);
      this.onParam.emit(value);
    }
  }

  private _searching = signal<boolean>(false);
  public get searching(): boolean {
    return this._searching();
  }
  private set searching(value: boolean) {
    if (value !== this.searching) {
      this._searching.set(value);
      this.onSearching.emit(value);
    }
  }

  public search(request?: IUserFormSearchParams): void {
    this.searching = true;
    this.formServ.search(request).subscribe({
      next: (response) => {
        this.onSearch.emit(response);
      },
      error: (error) => {
        this.onError.emit(error);
      },
      complete: () => {
        this.searching = false;
      }
    });
  }
}