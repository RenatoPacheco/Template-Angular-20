import { EventEmitter } from "@angular/core";
import { IManagerSearch, ManagerSearch } from "./manager-search";
import { catchError, EMPTY, finalize, Observable, Subscription, take, takeWhile, tap, throwError } from "rxjs";

export class ManagerOptions<T> implements IManagerSearch {

  constructor() {
    this._search.onFinalize.subscribe(() => {
      this.results = this._search.results;
    });
  }

  private _search = new ManagerSearch<T>();

  public get onInitialize(): EventEmitter<void> {
    return this._search.onInitialize;
  }
  public get onFinalize(): EventEmitter<void> {
    return this._search.onFinalize;
  }
  public get onClear(): EventEmitter<void> {
    return this._search.onClear;
  }

  public get $search(): Observable<T[]>|null {
    return this._search.$search;
  }
  public set $search(value: Observable<T[]>|null) {
    this._search.$search = value;
  }

  public get placeholder(): string {
      return this._search.placeholder;
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

  public get searching(): boolean {
    return this._search.searching;
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