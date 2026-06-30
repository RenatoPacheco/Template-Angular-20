export interface IInsertRequest {
  name: string;
  lastName: string;
  email: string;
  status: string;
}

export interface IUpdateRequest {
  id: string;
  name?: string;
  lastName?: string;
  email?: string;
  status?: string;
}

export interface IDeleteRequest {
  id: string[];
}

export interface ISearchRequest {
  user?: string|string[];
  status?: string|string[];
  query?: string;
  page?: number;
  pageSize?: number;
}