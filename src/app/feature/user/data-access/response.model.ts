export interface IGetResponse {
  id: string;
  name?: string;
  lastName?: string;
  email?: string;
  createdIn?: string;
  updatedIn?: string;
  status?: string;
}

export interface IInsertResponse extends IGetResponse {
}

export interface IUpdateResponse extends IGetResponse {
}

export interface ISearchResponse {
  results: IGetResponse[];
  total: number;
}