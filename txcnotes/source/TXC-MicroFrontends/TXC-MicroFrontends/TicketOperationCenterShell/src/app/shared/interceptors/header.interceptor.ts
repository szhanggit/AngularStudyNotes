import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';
import { EXCLUDED_PATH_NAMES, HEADER_LOADING_INDICATOR } from '../constants/http';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
    constructor(
        private authorizationLibraryService: AuthorizationLibraryService,
    ) { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const requestPathname = new URL(request.url).pathname;
        if (!EXCLUDED_PATH_NAMES.includes(requestPathname)) {
            const regularHeaders: HttpHeaders = this.authorizationLibraryService.getAMMHeaders();
            const reqeustHeaders: HttpHeaders = request.headers;
            let hasAppendedHeader = true;

            const reguestHeaderKeys = reqeustHeaders.keys();
            reguestHeaderKeys.forEach((key) => {
                if (key !== HEADER_LOADING_INDICATOR) {
                    hasAppendedHeader = false;
                }
            })

            if (hasAppendedHeader) {
                request = request.clone({
                    headers: regularHeaders
                })
            }
        }
        
        return next.handle(request);
    }
}
