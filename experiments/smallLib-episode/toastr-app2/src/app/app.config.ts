import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { DataService } from './service/data.service';
import { provideHttpClient } from '@angular/common/http';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(),
  importProvidersFrom(HttpClientInMemoryWebApiModule.forRoot(DataService)),
  provideEnvironmentNgxMask(), provideAnimationsAsync(),
  provideToastr(
    {
      closeButton: true, positionClass: 'toast-top-center',
      timeOut: 1000000,preventDuplicates:false
    }
  )
  ]
};
