import { EventEmitter } from "@angular/core";

import { catchError, EMPTY, finalize, Observable, Subscription, take, takeWhile, tap, throwError } from "rxjs";

export interface IManagerSearch {
  total: number;
  placeholder: string;
  searching: boolean;
  clear(): void;
  hasItems(): boolean;
}

export class ManagerSearch<T> implements IManagerSearch {

  public readonly onInitialize = new EventEmitter<void>();
  public readonly onFinalize = new EventEmitter<void>();
  public readonly onClear = new EventEmitter<void>();
  
  private placeholderSearching = 'Buscando...';
  private placeholderFound = 'Itens encontrados';
  private placeholderNotFound = 'Não há itens';

  get placeholder(): string {
    return this.searching ? this.placeholderSearching
      : this.hasItems() ? this.placeholderFound
      : this.placeholderNotFound;
  }

  private _total: number = 0;
  public get total(): number {
    return this._total;
  }
  private set total(value: number) {
    this._total = value;
  }

  private _results: T[] = [];
  public get results(): T[] {
    return this._results;
  }
  private set results(value: T[]) {
    this._results = value ?? [];
    this.total = this._results.length;
  }

  private _searching: boolean = false;
  public get searching(): boolean {
    return this._searching;
  }
  private set searching(value: boolean) {
    this._searching = value;
  }

  private _$search: Observable<T[]>|null = null;
  public get $search(): Observable<T[]>|null {
    return this._$search;
  }
  public set $search(value: Observable<T[]>|null) {
    this._search?.unsubscribe();
    this.results = [];
    if (value) {
      this.clear();
      this._searching = true;
      this._$search = value.pipe(
        take(1),
        takeWhile(() => this._searching),
        tap((item) => {
          this.results = item;
          this._searching = false;
        }),
        catchError((error) => {
          this._searching = false;
          return throwError(() => error);
        }),
        finalize(() => {
          this._searching = false;
          this.onFinalize.emit();
        })
      );
      this.onInitialize.emit();
    } else if (this.searching || this.hasItems()) {
      this.clear();
    }
  }

  private _search: Subscription|null = null;
  set search(value: Observable<T[]>|null) {
    this.$search = value;
    this._search = this.$search?.subscribe({
      error: () => EMPTY
    }) ?? null;
  }

  public clear(): void {
    this.results = [];
    this.total = 0;
    this.onClear.emit();
  }

  public hasItems(): boolean {
    return this._results.length > 0;
  }

}