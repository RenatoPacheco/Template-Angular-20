import { Component, HostListener, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ToastContainer } from '@app/core';
import { ResizeService } from './shared/services';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastContainer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

  private readonly servResize = inject(ResizeService);
  protected readonly title = signal('angular-20-template');

  @HostListener('window:resize', [])
  public onResize(): void {
    this.servResize.update();
  }
}
