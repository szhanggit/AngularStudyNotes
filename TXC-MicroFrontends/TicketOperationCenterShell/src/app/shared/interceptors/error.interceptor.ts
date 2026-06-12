import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ToastStateService } from '../services/toast-state.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  /**
   * Will trigger only on order service rest enpoints.
   * If used on other service, need to adjust error handling implementation
   */
  orderServiceEndpoints = ['Quotation/SignedQuotations', 'Order/ExportOrder'];

  constructor(private toastStateService: ToastStateService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (
      this.orderServiceEndpoints.some((endpoint) =>
        request.url.includes(endpoint)
      )
    ) {
      return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {
          const errorMessage =
            error?.error?.Message ||
            'Something went wrong. Please try again later.';
          this.toastStateService.toast = errorMessage;
          return throwError(() => errorMessage);
        })
      );
    }
    return next.handle(request);
  }
}
