import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'An unexpected error occurred';

      if (error.status === 0) {
        message = 'Cannot connect to server. Please ensure the backend is running.';
      } else if (error.status === 404) {
        message = error.error?.message || 'Resource not found';
      } else if (error.status === 409) {
        message = error.error?.message || 'Duplicate resource conflict';
      } else if (error.status === 400) {
        message = error.error?.message || 'Invalid request';
      } else if (error.status >= 500) {
        message = 'Server error. Please try again later.';
      }

      return throwError(() => ({ ...error, userMessage: message }));
    })
  );
};
