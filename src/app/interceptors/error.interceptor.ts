import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import * as Sentry from '@sentry/angular';
import { environment } from '../../environments/environment';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (environment.sentryDsn) {
        Sentry.captureException(err, {
          extra: {
            url: req.url,
            method: req.method,
            status: err.status,
            statusText: err.statusText,
          },
        });
      }
      return throwError(() => err);
    })
  );
};
