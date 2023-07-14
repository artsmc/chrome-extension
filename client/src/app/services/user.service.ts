import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class UserService {

//   constructor() { }
// }


import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, Subject, throwError } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { IUserState } from '../shared/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:3000/api/v1';
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  });

  private userSubject: BehaviorSubject<IUserState | null>;
  public user: Observable<IUserState | null>;
  loggedIn$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor(
    public http: HttpClient,
    private router: Router,
  ) {
    this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
    this.user = this.userSubject.asObservable();
  }
  public get userValue() {
    return this.userSubject.value;
  }

  public isLoggedIn(): ReplaySubject<boolean>{
    this.loggedIn$.next(!!this.userSubject.value);
    return this.loggedIn$;
  }
  // login(token: string | null) {
  //   // return this.http.get<any>(`${this.baseUrl}/auth/magiclogin auth/callback?token=${token}`).pipe(map(user => {
  //   return this.http.get<any>(`${this.baseUrl}/auth/magiclogin=${token}`).pipe(map(user => {
  //       // store user details and jwt token in local storage to keep user logged in between page refreshes
  //       localStorage.setItem('user', JSON.stringify(user));
  //       this.userSubject.next(user);
  //       return user;
  //     }));
  // }

  authToken(): Observable<any> {
    const token = localStorage.getItem('token')
    const url = `${this.baseUrl}/auth/callback?token=${token}`
    return this.http.get(url).pipe(catchError(this.handleError));
  }

  login(email: string): Observable <any> {
    const url = `${this.baseUrl}/auth/magiclogin`;
    const payload = {
      destination : email
    }
    return this.http
      .post(url,  payload)
      .pipe(catchError(this.handleError));
  }

  updateUser(agentName: string, companyName: string): Observable<any> {
    const token = localStorage.getItem('token')
    const url = `${this.baseUrl}/user/update-my-account`
    const payload = {
      agent : agentName,
      company : companyName
    }
    return this.http
      .post(url,  payload)
      .pipe(catchError(this.handleError));
  }
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/']);
  }

//   verifyEmail(email: string | null): Observable<string{
//     const url = `${this.baseUrl}/user/verify-email/`;
//     return this.

// .post < string(
//       url, { email })
//         .pipe(catchError(this.handleError));
//   }

//   magicLogin(destination: string | null): Observable<string{
//     const url = `${this.baseUrl}/auth/magiclogin`;
//     return this.

// .post < string(
//       url, { destination })
//         .pipe(catchError(this.handleError));
//   }
  // @ts-ignore
  // tslint:disable-next-line:no-any

  private handleError(error: any): Observable<any>{
    return throwError(error.error || 'Server error');
  }
}