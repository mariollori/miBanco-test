import { ApplicationConfig, DEFAULT_CURRENCY_CODE, LOCALE_ID, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeEsPe from '@angular/common/locales/es-PE'

registerLocaleData(localeEsPe,'es-PE')

export const appConfig: ApplicationConfig = {
  providers: [
    {provide:LOCALE_ID,useValue:'es-PE'},
    {provide:DEFAULT_CURRENCY_CODE,useValue:'PEN'},
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes)
  ]
};
