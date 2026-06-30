import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";

import { Observable } from "rxjs";

import { appConfig } from "@app/app.config";

import { IDeleteRequest, IInsertRequest, ISearchRequest, IUpdateRequest } from "./request.model";
import { IInsertResponse, ISearchResponse, IUpdateResponse } from "./response.model";

@Injectable({ providedIn: 'root' })
export class ApiService {

  protected http = inject(HttpClient);
  protected baseUrl: string = `${appConfig.api.baseUrl}/user`;

  public insert(request: IInsertRequest, options?:{
    ignoreLoading?: boolean;
  }): Observable<IInsertResponse> {
    const { ignoreLoading } = options || {};
    const headers = { 
      'X-Ignore-Loading': ignoreLoading ? 'true' : 'false',
    };

    return this.http.post<IInsertResponse>(`${this.baseUrl}`, request, { headers });
  }

  public patch(request: IUpdateRequest, options?:{
    ignoreLoading?: boolean;
  }): Observable<IUpdateResponse> {
    const { ignoreLoading } = options || {};
    const headers = { 
      'X-Ignore-Loading': ignoreLoading ? 'true' : 'false',
    };

    return this.http.patch<IUpdateResponse>(`${this.baseUrl}`, request, { headers });
  }

  public delete(request: IDeleteRequest, options?:{
    ignoreLoading?: boolean;
  }): Observable<void> {
    const { ignoreLoading } = options || {};
    const headers = { 
      'X-Ignore-Loading': ignoreLoading ? 'true' : 'false',
    };

    return this.http.delete<void>(`${this.baseUrl}`, { headers, body: request });
  }

  public search(request?: ISearchRequest, options?:{
    ignoreLoading?: boolean;
  }): Observable<ISearchResponse> {
    const { ignoreLoading } = options || {};
    const headers = { 
      'X-Ignore-Loading': ignoreLoading ? 'true' : 'false',
    };
    const params = new HttpParams({ fromObject: { ...request } });

    return this.http.get<ISearchResponse>(`${this.baseUrl}`, { headers, params });
  }
}