import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ToastContainer } from '@app/core';
import { FakeService, ResizeService } from './shared/services';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastContainer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {

  protected http = inject(HttpClient);
  private readonly servFake = inject(FakeService);
  private readonly servResize = inject(ResizeService);
  protected readonly title = signal('angular-20-template');

  @HostListener('window:resize', [])
  public onResize(): void {
    this.servResize.update();
  }

  ngOnInit(): void {
    this.servResize.update();
    this.http.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados/sp/municipios').subscribe();
    /*this.servFake.observable({ 
      result: true, 
      delay: 100 
    }).subscribe({
      next: () => {
        console.log('Test 100');
      }
    });

    this.servFake.observable({ 
      result: true, 
      delay: 1000 
    }).subscribe({
      next: () => {
        console.log('Test 1000');
      }
    });

    this.servFake.observable({ 
      result: true, 
      delay: 10000 
    }).subscribe({
      next: () => {
        console.log('Test 10000');
      }
    });*/
  }
}

