import { Injectable, EventEmitter } from '@angular/core';

import { ScreenSize } from '../models/screen-size';

@Injectable({
  providedIn: 'root'
})
export class ResizeService {

  constructor() {
    this.update();
  }

  readonly eventResize: EventEmitter<ScreenSize> = new EventEmitter();
  readonly eventHeight: EventEmitter<number> = new EventEmitter();
  readonly eventWidth: EventEmitter<number> = new EventEmitter();
  readonly eventMobile: EventEmitter<boolean> = new EventEmitter();
  readonly eventTablet: EventEmitter<boolean> = new EventEmitter();

  private maxWidth = {
    ms: 319,
    xs: 576,
    sm: 767,
    md: 991,
    lg: 1199
  };

  mobile = false;
  tablet = false;

  protected _size!: ScreenSize;
  get size(): ScreenSize {
    return this._size;
  }
  set size(value: ScreenSize) {
    if (this._size !== value) {
      this._size = value;
      this.eventResize.emit(this._size);
    }
  }

  protected _height!: number;
  get height(): number {
    return this._height;
  }
  set height(value: number) {
    if (this._height !== value) {
      this._height = value;
      this.eventHeight.emit(this._height);
    }
  }

  protected _width!: number;
  get width(): number {
    return this._width;
  }
  set width(value: number) {
    if (this._width !== value) {
      this._width = value;
      this.eventWidth.next(this._width);
    }
  }

  update(): void {
    this.height = window.innerHeight;
    this.width = window.innerWidth;
    let size = ScreenSize.MS;
    if (this.width > this.maxWidth.lg) {
      size = ScreenSize.XL;
    } else if (this.width > this.maxWidth.md) {
      size = ScreenSize.LG;
    } else if (this.width > this.maxWidth.sm) {
      size = ScreenSize.MD;
    } else if (this.width > this.maxWidth.xs) {
      size = ScreenSize.SM;
    } else if (this.width > this.maxWidth.ms) {
      size = ScreenSize.XS;
    }
    this.size = size;
    if (size < ScreenSize.MD && !this.mobile) {
      this.mobile = true;
      this.eventMobile.emit(true);
    } else if (size >= ScreenSize.MD && this.mobile) {
      this.mobile = false;
      this.eventMobile.emit(false);
    }

    if (size === ScreenSize.MD && !this.tablet) {
      this.tablet = true;
      this.eventTablet.emit(true);
    } else if (size > ScreenSize.MD && this.tablet) {
      this.mobile = false;
      this.eventTablet.emit(false);
    }
  }
}
