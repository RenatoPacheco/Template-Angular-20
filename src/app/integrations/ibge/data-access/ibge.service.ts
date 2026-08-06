import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map, Observable } from 'rxjs';

import type { IEstado, IMunicipio } from './ibge.model';
import { GetEstadosParams, GetMunicipiosParams } from './ibge.request';

@Injectable({ providedIn: 'root' })
export class IbgeService {

  private readonly httpClient = inject(HttpClient);
  private readonly baseUrl = 'https://servicodados.ibge.gov.br/api/v1/localidades';

  public getEstados(
    params: GetEstadosParams
  ): Observable<IEstado[]> {
    const { loading } = params;
    const headers = { 'X-Loading': loading === false ? 'false' : 'true' };
    const url = `${this.baseUrl}/estados`;

    return this.httpClient.get<IEstado[]>(url, { headers }).pipe(
      map((response: IEstado[]) => {
        if (Array.isArray(response)) {
          return response;
        }
        return [];
      })
    );
  }

  public getMunicipios(
    params: GetMunicipiosParams
  ): Observable<IMunicipio[]> {
    const { estado, loading } = params;
    const headers = { 'X-Loading': loading === false ? 'false' : 'true' };
    const url = `${this.baseUrl}/estados/${estado}/municipios`;

    return this.httpClient.get<IMunicipio[]>(url, { headers }).pipe(
      map((response: IMunicipio[]) => {
        if (Array.isArray(response)) {
          return response;
        }
        return [];
      })
    );
  }

}