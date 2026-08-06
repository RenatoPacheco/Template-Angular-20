import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map, Observable } from 'rxjs';

import type { ILogradouro } from './viacep.model';
import type { GetLogradouroParams } from './viacep.request';

@Injectable({ providedIn: 'root' })
export class ViacepService {

  private readonly httpClient = inject(HttpClient);
  private readonly baseUrl = 'https://viacep.com.br/ws';

  public getLogradouro(
    params: GetLogradouroParams
  ): Observable<ILogradouro | null> {
    const { cep, loading } = params;
    const headers = { 'X-Loading': loading === false ? 'false' : 'true' };
    const url = `${this.baseUrl}/${cep}/json`;

    return this.httpClient.get<ILogradouro | null>(url, { headers }).pipe(
      map((response: ILogradouro | null) => {
        if (response && response.cep) {
          return response;
        }
        return null;
      })
    );
  }
}