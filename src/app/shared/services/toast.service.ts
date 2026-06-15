import { Injectable, signal, TemplateRef } from '@angular/core';

export type ToastType =
  | 'success'
  | 'danger'
  | 'warning'
  | 'info';

export interface ToastMessage {
  id: string;
  title?: string;
  message: string;
  type: ToastType;
  delay?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {

  private readonly _toasts = signal<ToastMessage[]>([]);
  public readonly toasts = this._toasts.asReadonly();

  public show(
    message: string,
    type: ToastType = 'info',
    title?: string,
    delay = 5000
  ): void {

    const toast: ToastMessage = {
      id: crypto.randomUUID(),
      title,
      message,
      type,
      delay
    };

    this._toasts.update(items => [...items, toast]);
  }

  public success(
    message: string,
    title = 'Sucesso'
  ): void {
    this.show(message, 'success', title);
  }

  public error(
    message: string,
    title = 'Erro'
  ): void {
    this.show(message, 'danger', title);
  }

  public warning(
    message: string,
    title = 'Atenção'
  ): void {
    this.show(message, 'warning', title);
  }

  public info(
    message: string,
    title = 'Informação'
  ): void {
    this.show(message, 'info', title);
  }

  public remove(id: string): void {
    this._toasts.update(
      items => items.filter(x => x.id !== id)
    );
  }

  public clear(): void {
    this._toasts.set([]);
  }
}