import { EventEmitter, inject, Injectable } from "@angular/core";

import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

import { LoadingContainer } from "./loading-container";

@Injectable({ providedIn: 'root' })
export class LoadingService {

  private modal = inject(NgbModal);
  private modalRef?: NgbModalRef;
  private ids: string[] = [];

  /**
   * Evento disparado quando um loading é iniciado.
   */
  public readonly start = new EventEmitter<void>();

  /**
   * Evento disparado quando todos os loadings são finalizados.
   */
  public readonly stop = new EventEmitter<void>();

  /**
   * Indica se há algum loading ativo.
   * @returns boolean - true se houver loading ativo, false caso contrário.
   */
  public get isLoading(): boolean {
    return this.ids.length > 0;
  }

  /**
   * Mostra o modal de loading e retorna um id único para o loading.
   * @returns string - Id único do loading. 
   */
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

  /**
   * Esconde o modal de loading correspondente ao id fornecido.
   * @param id - Id único do loading a ser escondido.
   */
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

  /**
   * Reseta o estado do serviço de loading, fechando o modal e limpando os ids.
   * Dispara o evento de stop caso haja algum loading ativo.
   */
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
