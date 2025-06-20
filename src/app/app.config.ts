import {
 ApplicationConfig,
 importProvidersFrom,
 provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import {
 provideTanStackQuery,
 QueryClient,
} from '@tanstack/angular-query-experimental';
import { routes } from './app.routes';
import { ApiConfiguration } from '../api/api-configuration';
import { FormlyModule } from '@ngx-formly/core';
import { RepeatTypeComponent } from './Petstore/repeat-section.type';


export const appConfig: ApplicationConfig = {
 providers: [
   provideZoneChangeDetection({ eventCoalescing: true }),
   provideRouter(routes),
   provideHttpClient(),
   importProvidersFrom(
     FormlyModule.forRoot({
       types: [{ name: 'repeat', component: RepeatTypeComponent }],
     }),
   ),


   provideTanStackQuery(new QueryClient()),
   {
     provide: ApiConfiguration,
     useValue: { rootUrl: 'https://petstore3.swagger.io/api/v3' },
   },
 ],
};



