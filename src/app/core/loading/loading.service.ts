import { EventEmitter, inject, Injectable } from "@angular/core";

import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

import { LoadingContainer } from "./loading-container";

@Injectable({ providedIn: 'root' })
export class LoadingService {

  private modal = inject(NgbModal);
  private modalRef?: NgbModalRef;
  private loadingCount = 0;

  public readonly start = new EventEmitter<void>();
  public readonly stop = new EventEmitter<void>();

  public get isLoading(): boolean {
    return this.loadingCount > 0;
  }

  public show() {
    this.loadingCount++;
    if (this.modalRef) {
      return;
    }

    this.modalRef = this.modal.open(LoadingContainer, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
      windowClass: 'loading-modal'
    });
    this.start.emit();
  }

  public hide() {
    this.loadingCount--;
    if (this.loadingCount === 0) {
      this.modalRef?.close();
      this.modalRef = undefined;
      this.stop.emit();
    }
  }

  public reset() {
    const isLoading = this.isLoading;
    this.loadingCount = 0;
    this.modalRef?.close();
    this.modalRef = undefined;
    if (isLoading) {
      this.stop.emit();
    }
  }
}
