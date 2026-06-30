import { inject, Injectable } from "@angular/core";

import { forkJoin, lastValueFrom, Observable, of, tap } from "rxjs";

import { User, UserService } from "../../data-access";
import { IUserFormSearchParams, IUserFormSearchResolved } from "./user-form-search.model";

@Injectable({ providedIn: 'root' })
export class UserFormSearchService {

  private readonly servData = inject(UserService);

  public async resolve(
    params: IUserFormSearchParams,
    options?: { ignoreLoading?: boolean; }
  ): Promise<IUserFormSearchResolved> {
    const result: IUserFormSearchResolved = {
      status: [],
      params: params
    };

    await lastValueFrom(forkJoin({
      status: this.listStatus()
    }).pipe(
      tap((resp) => {
        result.status = resp.status;
      })
    ));

    return result;
  }

  public extracParameters(input: {
    param: IUserFormSearchParams, 
    currentParams?: IUserFormSearchParams
  }): IUserFormSearchParams {
    const { param, currentParams } = input;
    return {
      ...currentParams,
      ...param
    };
  }

  public listStatus(): Observable<string[]> {
    return of([
      'Active',
      'Inactive',
      'Pending',
      'Suspended',
      'Excluded'
    ]);
  }

  public search(request?: IUserFormSearchParams, options?:{
    ignoreLoading?: boolean;
  }): Observable<User[]> {
    return this.servData.search(request, options).pipe();
  }
}