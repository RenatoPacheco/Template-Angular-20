import { HttpInterceptorFn } from "@angular/common/http";

import { LocalStorageService } from "../storage/local-storage.service";
import { inject } from "@angular/core";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storageService = inject(LocalStorageService);
  const token = storageService.getItem<string>('authToken');
  if (token) {
    const newReq = req.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });
    return next(newReq);
  }

  return next(req);
};