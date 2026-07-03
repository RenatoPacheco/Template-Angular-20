import { EventEmitter, inject, Injectable } from "@angular/core";

import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

import { LoadingContainer } from "./loading-container";

@Injectable({ providedIn: 'root' })
export class LoadingService {

  private modal = inject(NgbModal);
  private modalRef?: NgbModalRef;
  private ids: string[] = [];

  public readonly start = new EventEmitter<void>();
  public readonly stop = new EventEmitter<void>();

  public get isLoading(): boolean {
    return this.ids.length > 0;
  }

  public show(): string {
    const result = crypto.randomUUID();
    this.ids.push(result);
    if (this.modalRef) {
      return result;
    }

    this.modalRef = this.modal.open(LoadingContainer, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
      windowClass: 'loading-modal'
    });
    this.start.emit();
    return result;
  }

  public hide(id: string) {
    const index = this.ids.indexOf(id);
    if (index !== -1) {
      this.ids.splice(index, 1);
    }
    if (this.ids.length === 0) {
      this.modalRef?.close();
      this.modalRef = undefined;
      this.stop.emit();
    }
  }

  public reset() {
    const isLoading = this.isLoading;
    this.ids = [];
    this.modalRef?.close();
    this.modalRef = undefined;
    if (isLoading) {
      this.stop.emit();
    }
  }
}
