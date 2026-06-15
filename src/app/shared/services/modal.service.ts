import { inject, Injectable, TemplateRef, Type } from '@angular/core';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

export type ModalRef = NgbModalRef;

@Injectable({ providedIn: 'root' })
export class ModalService {

  private modal = inject(NgbModal);

  public open<T>(
    component: Type<T>|TemplateRef<T>,
    options?: NgbModalOptions
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