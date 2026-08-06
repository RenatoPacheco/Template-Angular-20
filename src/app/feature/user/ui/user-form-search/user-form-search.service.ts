import { inject, Injectable } from "@angular/core";

import { forkJoin, lastValueFrom, Observable, of, tap } from "rxjs";

import { User, UserService } from "../../data-access";
import { IUserFormSearchData, IUserFormSearchParams, IUserFormSearchResolved } from "./user-form-search.model";
import { FakeService } from "@app/shared/services";

@Injectable({ providedIn: 'root' })
export class UserFormSearchService {

  private readonly servData = inject(UserService);
  private readonly servFake = inject(FakeService);

  public async resolve(
    params: IUserFormSearchParams,
    options?: { ignoreLoading?: boolean; }
  ): Promise<IUserFormSearchResolved> {
    const result: IUserFormSearchResolved = {
      data: {
        status: []
      },
      params: params
    };

    await lastValueFrom(forkJoin({
      status: this.listStatus()
    }).pipe(
      tap((resp) => {
        result.data.status = resp.status;
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
    return this.servFake.observable({
      delay: 10000,
      result: [
        'Active',
        'Inactive',
        'Pending',
        'Suspended',
        'Excluded'
      ]
    });
  }

  public search(request?: IUserFormSearchParams, options?:{
    ignoreLoading?: boolean;
  }): Observable<User[]> {
    return this.servData.search(request, options).pipe();
  }
}