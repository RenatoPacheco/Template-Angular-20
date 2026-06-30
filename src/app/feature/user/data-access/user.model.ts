import { transformDate } from "@app/shared/utils";

export interface IUser {
  id?: string|null;
  name?: string|null;
  lastName?: string|null;
  email?: string|null;
  createdIn?: string|Date|null;
  updatedIn?: string|Date|null;
  status?: string|null;
}

export class User implements IUser {
  public id: string|null = null;
  public name: string|null = null;
  public lastName: string|null = null;
  public email: string|null = null;
  public createdIn: Date|null = null;
  public updatedIn: Date|null = null;
  public status: string|null = null;
  
  public constructor(init?: IUser) {
    if (init) {
      this.id = init.id || null;
      this.name = init.name || null;
      this.lastName = init.lastName || null;
      this.email = init.email || null;
      this.status = init.status || null;
      this.createdIn = transformDate(init.createdIn) || null;
      this.updatedIn = transformDate(init.updatedIn) || null;
    }
  }
  
  public toString(): string {
    return this.name ? (this.name + ' ' + this.lastName).trim() : '';
  }

  public isNew(): boolean {
    return !this.id;
  }
}