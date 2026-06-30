import { IUser } from "../../data-access";

export interface IUserFormManagerResolved {
  status: string[];
  values: IUser
}