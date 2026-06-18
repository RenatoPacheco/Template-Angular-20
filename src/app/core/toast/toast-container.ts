import { Component, inject } from '@angular/core';
import { ToastService, ToastType } from '@app/core';

import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [NgbToastModule],
  templateUrl: './toast-container.html',
  styleUrl: './toast-container.scss'
})
export class ToastContainer {

  protected readonly service = inject(ToastService);

  protected toastClass(type: ToastType): string {

  switch (type) {
    case 'success':
      return 'text-bg-success';

    case 'danger':
      return 'text-bg-danger';

    case 'warning':
      return 'text-bg-warning';

    default:
      return 'text-bg-info';
  }
}

}