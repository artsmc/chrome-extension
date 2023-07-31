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

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:3000/api/v1';
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
    console.log(this.router.url);
  
    // this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('token')!));
    // this.userSubject = new BehaviorSubject(localStorage.getItem('token'));
    // this.user = this.userSubject.asObservable();
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

  setResponse(tone: string, emoji: string, charLimit: number, custInq: string): Observable<any> {
    console.log('values', tone, emoji, charLimit, custInq);
    
    const url = `${this.baseUrl}/response/agent-request`
    const payload = {
      tone: tone,
      feelings: true,
      emojiAllowed: emoji,
      characterLimit: charLimit,
      customerInquery: custInq,
      agentContext: ""
    }
    return this.http
      .post(url,  payload)
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
      email: email,
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