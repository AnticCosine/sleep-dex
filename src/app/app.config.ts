import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode, provideAppInitializer } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth-interceptor';
import { provideServiceWorker } from '@angular/service-worker';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter(routes),
    provideAppInitializer(() => checkAppVersion()),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    })
  ],
};

function checkAppVersion() {
  const versionKey = 'app_version';
  const storedVersion = localStorage.getItem(versionKey);

  if (storedVersion !== environment.appVersion || storedVersion == null) {
    localStorage.removeItem('ingredientCalculatorFilters');
    localStorage.removeItem('recipeFilters');

    localStorage.setItem(versionKey, environment.appVersion);
  }
}
