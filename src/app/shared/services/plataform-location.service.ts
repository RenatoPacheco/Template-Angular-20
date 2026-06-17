import { Injectable, EventEmitter } from '@angular/core';
import { PlatformLocation } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class PlataformLocationService {

  constructor(
    private location: PlatformLocation) {
      if (!PlataformLocationService.initialized) {
        PlataformLocationService.initialized = true;
        this.location?.onPopState(() => {
          this.popState.emit();
        });
        location?.onHashChange(() => {
          this.hashChange.emit();
        });
      }
  }

  private static initialized = false;
  public readonly popState: EventEmitter<void> = new EventEmitter<void>();
  public readonly hashChange: EventEmitter<void> = new EventEmitter<void>();
}
