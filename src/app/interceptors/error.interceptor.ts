import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import * as Sentry from '@sentry/angular';
import { environment } from '../../environments/environment';

/**
 * HttpErrorResponse does not extend Error. Rethrowing it breaks tooling that
 * expects `instanceof Error` (e.g. Angular SSR route extraction worker).
 */
function asErrorForStream(err: HttpErrorResponse): Error {
  const e = new Error(err.message);
  e.name = err.name;
  (e as Error & { cause: HttpErrorResponse }).cause = err;
  return e;
}

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
      return throwError(() => asErrorForStream(err));
    }),
  );
};
