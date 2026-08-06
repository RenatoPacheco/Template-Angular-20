import { inject } from "@angular/core";
import { HttpInterceptorFn } from "@angular/common/http";

import { finalize } from "rxjs";

import { LoadingService } from "../loading/loading.service";

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  const useLoading = !(req.headers.get('X-Ignore-Loading') !== 'true');
  const id = useLoading ? loadingService.show() : null;

  const newReq = req.clone({
    headers: req.headers.delete('X-Ignore-Loading')
  });
  
  return next(newReq).pipe(
      finalize(() => {
        if (useLoading && id !== null) {
          loadingService.hide(id);
        }
      })
    );
};