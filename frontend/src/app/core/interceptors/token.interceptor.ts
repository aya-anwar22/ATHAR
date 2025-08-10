import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const TokenInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const accessToken = localStorage.getItem('accessToken');

  let authReq = req;
  if (accessToken) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // لو حصلت مشكلة توكن منتهي أو Refresh Token بايظ
      if (
        error.status === 401 ||
        (error.status === 404 && error.error?.message === 'Invalid refresh token')
      ) {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          return authService.refreshToken({ refreshToken }).pipe(
            switchMap((res: any) => {
              const newAccessToken = res.accessToken;
              localStorage.setItem('accessToken', newAccessToken);

              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newAccessToken}`
                }
              });

              return next(retryReq);
            }),
            catchError(err => {
              console.error('Refresh failed:', err);
              // امسح التوكنات وارجع لصفحة اللوجين
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              authService.logout();
              router.navigate(['/login'], {
                queryParams: { sessionExpired: 'true' }
              });
              return throwError(() => err);
            })
          );
        } else {
          // مفيش refresh token → خروج
          authService.logout();
          router.navigate(['/login'], {
            queryParams: { sessionExpired: 'true' }
          });
        }
      }

      return throwError(() => error);
    })
  );
};
