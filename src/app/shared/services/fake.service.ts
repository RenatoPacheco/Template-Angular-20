import { Injectable, inject } from '@angular/core';
import { LoadingService } from '@app/core';

import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class FakeService {

  private loading = inject(LoadingService);

  public observable<T>(param: {
    result: T,
    delay?: number,
    ignoreLoading?: boolean;
  }): Observable<T> {
    param.delay = param.delay ?? 1500;
    param.ignoreLoading = param.ignoreLoading ?? false;
    return of(param.result).pipe(
      tap(() => {
        if (!param.ignoreLoading) {
          this.loading.show();
        }
      }),
      delay(param.delay),
      tap(() => {
        if (!param.ignoreLoading) {
          this.loading.hide();
        }
      }),
    );
  }
}
