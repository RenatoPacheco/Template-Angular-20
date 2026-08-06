import { ISearchRequest } from "../../data-access";

export interface IUserFormSearchResolved {
  data: IUserFormSearchData;
  params: IUserFormSearchParams;
}

export interface IUserFormSearchData {
  status: string[];
}

export interface IUserFormSearchParams extends ISearchRequest {

}