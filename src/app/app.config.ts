import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { restoreAuthStateInitializer } from '@core/auth/initializers/restore-auth-state.initializer';
import { addAuthHeaderInterceptor } from '@core/auth/interceptors/add-auth-header-interceptor';

import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([addAuthHeaderInterceptor])),
    restoreAuthStateInitializer(),
  ],
};
