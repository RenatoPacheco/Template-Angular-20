import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import packageJson from '../../package.json';
import { routes } from './app.routes';
import { authInterceptor, errorInterceptor, loadingInterceptor } from './core';

export const bootstrapAppConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        loadingInterceptor,
        authInterceptor,
        errorInterceptor
      ])
    )
  ]
};

export const appConfig = {
  guid: '4b389eb0-84d0-42e3-9a5f-157760d78aac',
  name: 'Angular 20 Template',
  version: packageJson.version,
  description: 'Angular 20 Template',
  api: {
    baseUrl: 'http://localhost:3000',
    timeout: 30000
  }

}
