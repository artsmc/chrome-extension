import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { UserService } from './services/user.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private authenticationService: UserService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // console.log('interceptor');

    // let authReq = request.clone();
    // const token = localStorage.getItem('token');

    // if (token) {
    //   const authHeader = `Bearer ${token}`;
    //   authReq = authReq.clone({ setHeaders: { Authorization: authHeader } });
    // }
    // return next.handle(authReq);

    // //Testing new code
    let authReq = request.clone();
    const token = localStorage.getItem('token');

    if (token) {
      const authHeader = `Bearer ${token}`;
      authReq = authReq.clone({ setHeaders: { Authorization: authHeader } });
    }
    return next.handle(authReq)
      .pipe(catchError(err => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401 || err.status === 403) {
            this.authenticationService.logout()
          }
        }
        return throwError(() => err);
      }));
  }
}
