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
    const data = {...param, id: '' } 
    data.delay = data.delay ?? 1500;
    data.ignoreLoading = data.ignoreLoading ?? false;
    return of(data.result).pipe(
      tap(() => {
        if (!data.ignoreLoading) {
          data.id = this.loading.show();
        }
      }),
      delay(data.delay),
      tap(() => {
        if (!data.ignoreLoading) {
          this.loading.hide(data.id);
        }
      }),
    );
  }
}
