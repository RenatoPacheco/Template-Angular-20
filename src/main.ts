/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { bootstrapAppConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, bootstrapAppConfig)
  .catch((err) => console.error(err));
