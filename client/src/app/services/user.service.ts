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

  private userSubject!: BehaviorSubject<IUserState | null>;
  // public user: Observable<IUserState | null>;
  loggedIn$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor(
    public http: HttpClient,
    private route: Router,
    private router: ActivatedRoute
  ) {
    
    // this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('token')!));
    // this.userSubject = new BehaviorSubject(localStorage.getItem('token'));
    // this.user = this.userSubject.asObservable();
  }

  // private getUserData(): void {
  //   this.router.queryParams
  //     .subscribe(params => {
  //       const queryParams = Object.values(params)
  //       const token = queryParams[0]
  //       if(token !== undefined){
  //         localStorage.setItem('token', token)
  //       }
  //       if (token) {
  //         this.route.navigate(['/signup']);
  //         this.authToken().subscribe((res) => {
  //           console.log(res.jwt);
  //           localStorage.setItem('token', res)
  //           this.setUserValue(res)
            
  //         })
  //       }
  //     })
  // }

  public getUserValue(): any {
    // this.getUserData()
    return this.userSubject;
  }

  public setUserValue(userData: IUserState) {
    this.userSubject.next(userData);
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

  setResponse(tone: string, emoji: string, charLimit: number, custInq: string): Observable<any> {
    console.log('values', tone, emoji, charLimit, custInq);
    
    const url = `${this.baseUrl}/reponse/agent-request`
    const payload = {
      tone: tone,
      emojiAllowed: emoji,
      characterLimit: charLimit,
      customerInquery: custInq
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