import { Component, inject, Input, OnInit, signal } from "@angular/core";
import { IUserFormSearchParams, IUserFormSearchResolved } from "./user-form-search.model";
import { UserFormSearchService } from "./user-form-search.service";

@Component({
  standalone: true,
  selector: 'app-user-form-search',
  templateUrl: './user-form-search.component.html',
  styleUrls: ['./user-form-search.component.scss'],
})
export class UserFormSearchComponent implements OnInit {

  public ngOnInit(): void {

    if (!this.resolved) {
      this.search(this.params ?? undefined);
    }    
  }

  protected formService = inject(UserFormSearchService);

  protected _resolved = signal<IUserFormSearchResolved | null>(null);
  @Input() public get resolved(): IUserFormSearchResolved | null {
    return this._resolved();
  }
  public set resolved(value: IUserFormSearchResolved | null) {
    this._resolved.set(value ?? null);
    this.params = value?.params ?? null;
  }

  protected _params = signal<IUserFormSearchParams | null>(null);
  @Input() public get params(): IUserFormSearchParams | null {
    return this._params();
  }
  public set params(value: IUserFormSearchParams | null) {
    this._params.set(value ?? null);
  }

  public search(request?: IUserFormSearchParams): void {
    this.formService.search(request).subscribe({
      next: (response) => {
        console.log('Search response:', response);
      },
      error: (error) => {
        console.error('Search error:', error);
      }
    });
  }
}