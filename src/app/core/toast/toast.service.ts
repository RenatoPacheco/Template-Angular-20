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

  public show(param: {
    message: string|string[],
    type?: ToastType,
    title?: string,
    delay?: number
  }): string {    
    const messages: string[] = Array.isArray(param.message) ? param.message : [param.message];
    const type = param.type || 'info';
    const title = param.title;
    const delay = param.delay || 5000;
    const id = crypto.randomUUID();
    let count = 0;
    messages.forEach(message => {
      this._toasts.update(items => [...items, {
        type, message, 
        title, delay, 
        id: `${id}:${++count}`
      }]);
    });
    return id;
  }

  public success(param: {
    message: string|string[],
    title?: string
  }): string {
    return this.show({
      message: param.message,
      title: param.title,
      type: 'success'
    });
  }

  public error(param: {
    message: string|string[],
    title?: string
  }): string {
    return this.show({
      message: param.message,
      title: param.title,
      type: 'danger'
    });
  }

  public warning(param: {
    message: string|string[],
    title?: string
  }): string {
    return this.show({
      message: param.message,
      title: param.title,
      type: 'warning'
    });
  }

  public info(param: {
    message: string|string[],
    title?: string
  }): string {
    return this.show({
      message: param.message,
      title: param.title,
      type: 'info'
    });
  }

  public remove(id: string|null): void {
    if (id) {
      this._toasts.update(
        items => items.filter(x => !x.id.startsWith(id))
      );
    }
  }

  public clear(): void {
    this._toasts.set([]);
  }
}