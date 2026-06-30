import { inject, Injectable } from "@angular/core";

import { map, Observable } from "rxjs";

import { ApiService } from "./api.service";
import { IDeleteRequest, IInsertRequest, ISearchRequest, IUpdateRequest, User } from "../data-access";

@Injectable({ providedIn: 'root' })
export class UserService {

  protected servApi = inject(ApiService);

  public insert(request: IInsertRequest, options?:{
    ignoreLoading?: boolean;
  }): Observable<User> {
    return this.servApi.insert(request, options).pipe(
      map((response) => new User(response))
    );
  }

  public update(request: IUpdateRequest, options?:{
    ignoreLoading?: boolean;
  }): Observable<User> {
      return this.servApi.patch(request, options).pipe(
        map((response) => new User(response))
      );
    }

  public delete(request: IDeleteRequest, options?:{
    ignoreLoading?: boolean;
  }): Observable<void> {
    return this.servApi.delete(request, options);
  }

  public search(request?: ISearchRequest, options?:{
    ignoreLoading?: boolean;
  }): Observable<User[]> {
    return this.servApi.search(request, options).pipe(
      map((response) => response.results.map((item) => new User(item)))
    );
  }

}