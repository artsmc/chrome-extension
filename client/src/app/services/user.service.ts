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
import { ActivatedRoute, Router } from '@angular/router';
import { IUserState } from '../shared/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = environment.apiUrl;
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  });

  public isPanelOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  // isPanelOpen$: Observable<boolean> = this.isPanelOpen.asObservable();
   url: string = "";

  private userSubject!: BehaviorSubject<IUserState | null>;
  // public user: Observable<IUserState | null>;
  loggedIn$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor(
    public http: HttpClient,
    private route: Router,
    private router: ActivatedRoute
  ) {
  }


  public getUserValue(): any {
    // this.getUserData()
    return localStorage.getItem('token');
  }

  public setUserValue(userData: IUserState) {
    this.userSubject.next(userData);
  }

  public isLoggedIn(): ReplaySubject<boolean>{
    this.loggedIn$.next(!!this.userSubject.value);
    return this.loggedIn$;
  }


  authToken(): Observable<any> {
    const token = localStorage.getItem('token')
    const url = `${this.baseUrl}/auth/callback?token=${token}`
    return this.http.get(url).pipe(catchError(this.handleError));
  }
  verify(): Observable<any> {
    const token = localStorage.getItem('token');
    const url = `${this.baseUrl}/auth/verify`;
    return this.http.get(url).pipe(catchError(this.handleError));
  }

  login(email: string, password: string): Observable <any> {
    const url = `${this.baseUrl}/auth/login`;
    const payload = {
      email : email,
      password: password
    }
    return this.http
      .post(url,  payload)
      .pipe(catchError(this.handleError));
  }
  forgotPassword(email: string, location: string): Observable <any> {
    const url = `${this.baseUrl}/auth/forgot-password`;
    const payload = {
      email,
      location
    }
    return this.http
      .post(url,  payload)
      .pipe(catchError(this.handleError));
  }
  verifyPassword(form:{email: string, resetNumber: number}): Observable <any> {
    const url = `${this.baseUrl}/auth/verify-reset`;
    return this.http
      .post(url,  form)
      .pipe(catchError(this.handleError));
  }
  setPassword(form:{password: string}): Observable <any> {
    const url = `${this.baseUrl}/auth/change-password`;
    return this.http
      .post(url,  form)
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

  setResponse(form:{tone: string, emojiAllowed: string, characterLimit: number, customerInquery: string}): Observable<any> {
    const token = localStorage.getItem('token')
    const url = `${this.baseUrl}/response/agent-request`
    return this.http
      .post(url, form, {headers:{
        authorization: `Bearer ${token}`
      }, responseType: 'text',
      observe: 'body'})
      .pipe(catchError(this.handleError));
  }
  setSummary(form:{tone: string, customerInquery: string}): Observable<any> {
    console.log({form})
    const token = localStorage.getItem('token')
    const url = `${this.baseUrl}/response/agent-summary`
    return this.http
      .post(url, form, {headers:{
        authorization: `Bearer ${token}`
      }, responseType: 'text',
      observe: 'body'})
      .pipe(catchError(this.handleError));
  }
  setSentiment(form:{tone: string, customerInquery: string}): Observable<any> {
    const token = localStorage.getItem('token')
    const url = `${this.baseUrl}/response/agent-sentiment`
    return this.http
      .post(url, form, {headers:{
        authorization: `Bearer ${token}`
      }, responseType: 'text',
      observe: 'body'})
      .pipe(catchError(this.handleError));
  }
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.route.navigate(['/']);
  }

  createUser(email: string, password: string, fullName: string): Observable<any> {
    const token = localStorage.getItem('token');
    const url =`${this.baseUrl}/auth/create`;
    const payload  = {
      email: email.toLowerCase(),
      password: password,
      full_name: fullName
    }
    return this.http
      .post(url,  payload)
      .pipe(catchError(this.handleError));
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