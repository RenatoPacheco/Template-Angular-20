import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ToastContainer } from '@app/shared/components';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastContainer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('angular-20-template');
}
