import { inject, Injectable, TemplateRef, Type } from '@angular/core';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

export type ModalRef = NgbModalRef;
export type ModalOptions = NgbModalOptions;

@Injectable({ providedIn: 'root' })
export class ModalService {

  private modal = inject(NgbModal);

  public open<T>(
    component: Type<T>|TemplateRef<T>,
    options?: ModalOptions
  ): ModalRef {
    return this.modal.open(component, {
      centered: true,
      backdrop: 'static',
      ...options
    });
  }

  public dismissAll(): void {
    this.modal.dismissAll();
  }

}