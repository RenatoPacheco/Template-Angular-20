import { ISearchRequest } from "../../data-access";

export interface IUserFormSearchResolved {
  status: string[];
  params: IUserFormSearchParams;
}

export interface IUserFormSearchParams extends ISearchRequest {

}