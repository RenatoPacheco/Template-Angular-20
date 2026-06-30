import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";

import { IUserFormSearchResolved, UserFormSearchService } from "./ui";

export const SearchResolver: ResolveFn<IUserFormSearchResolved> = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Promise<IUserFormSearchResolved> => {
  const servForm = inject(UserFormSearchService);

  return  new Promise((resolve, reject) => {
    servForm.resolve({
      user: route.queryParams['user'],
      status: route.queryParams['status'],
      query: route.queryParams['query'],
      page: route.queryParams['page'],
      pageSize: route.queryParams['pageSize']
    }).then(resp => {
      resolve(resp);
    }).catch(error => {
      reject(error);
    })
  });
}