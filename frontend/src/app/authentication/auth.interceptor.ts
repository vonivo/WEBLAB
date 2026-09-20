import { HttpErrorResponse, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

function isTokenExpired(token: string): boolean {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    return typeof payload.exp === 'number' && payload.exp * 1000 <= Date.now();
  } catch {
    // Not a decodable JWT, so expiry can't be determined client-side
    return false;
  }
}

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const authService = inject(AuthService);
  const authToken = authService.getToken();

  if (authToken) {
    if (isTokenExpired(authToken.accessToken)) {
      authService.logout();
    }

    const newReq = req.clone({
      headers: req.headers.append('Authorization', `Bearer ${authToken.accessToken}`),
    });

    return next(newReq).pipe(
      catchError((error: unknown) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          console.error(
            `[authInterceptor] Server rejected access token with 401 (request: ${req.method} ${req.url})`,
          );
          authService.logout();
        }
        return throwError(() => error);
      }),
    );
  }

  return next(req);
}
