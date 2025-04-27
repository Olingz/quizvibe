import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from '../environments/environment';

// Initialize Firebase
const app = initializeApp(environment.firebase);
const auth = getAuth(app);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(BrowserModule),
    { provide: 'FIREBASE_AUTH', useValue: auth }
  ]
};
