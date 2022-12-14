import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, of, Subject, tap, throwError } from 'rxjs';
import { ResponseModel } from 'src/assets/model/ResponseModel';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // url of authentication server
  private rootUrl = 'http://localhost:8081/';
  constructor(private http: HttpClient, private router: Router) {}

  // sends credentials and receives jwt
  public signIn(email: string, password: string): Observable<ResponseModel> {
    let endpoint = 'signin';
    return this.http
      .post<ResponseModel>(this.rootUrl + endpoint, {
        email,
        password,
      })
      .pipe(tap(this.setUser), catchError(this.handleError));
  }

  // clear the localstorage
  public signOut(): void {
    localStorage.clear();
  }

  // post user data and receive jwt
  public signUp(
    email: string,
    password: string,
    fullName: string,
    roleFarmer: boolean
  ): Observable<ResponseModel> {
    let endpoint = 'signup';
    let role = roleFarmer ? 'ROLE_FARMER' : 'ROLE_DEALER';
    return this.http
      .post<ResponseModel>(this.rootUrl + endpoint, {
        email: email,
        password: password,
        fullName: fullName,
        roles: role,
      })
      .pipe(tap(this.setUser), catchError(this.handleError));
  }
  public signUpAdmin(
    email: string,
    password: string,
    fullName: string,
    roleAdmin: string
  ): Observable<ResponseModel> {
    let endpoint = 'signup';
    return this.http
      .post<ResponseModel>(this.rootUrl + endpoint, {
        email: email,
        password: password,
        fullName: fullName,
        roles: roleAdmin,
      })
      .pipe(tap(this.setUser), catchError(this.handleError));
  }

  // post user email and preferred password reset method, return acknowledgement of further communication
  public forgotPassword(
    email: string,
    method: string
  ): Observable<ResponseModel> {
    let endpoint = 'forgot-password?email=' + email + '&method=' + method;
    return this.http
      .post<ResponseModel>(this.rootUrl + endpoint, {})
      .pipe(tap(this.setUserId), catchError(this.handleError));
  }
  // post user email and otp, return if the otp is valid
  public validateOtp(id: string, resetCode: string): Observable<boolean> {
    let endpoint = 'forgot-password/otp';
    return this.http
      .post<boolean>(this.rootUrl + endpoint, {
        id,
        resetCode,
      })
      .pipe(catchError(this.handleError));
  }

  // post jwt and receive refreshed jwt if valid
  public validateJwt(): Observable<ResponseModel> {
    let endpoint = 'validate-token';
    let jwt = localStorage.getItem('jwt') || '';
    return this.http
      .post<ResponseModel>(this.rootUrl + endpoint, { jwt })
      .pipe(tap(this.setUser), catchError(this.handleError));
  }

  // post new password and reset token, receives jwt
  public resetPassword(
    password: string,
    resetToken: string
  ): Observable<ResponseModel> {
    let endpoint = 'forgot-password/reset';
    return this.http
      .post<ResponseModel>(
        this.rootUrl + endpoint + '?resetToken=' + resetToken,
        { password }
      )
      .pipe(tap(this.setUser), catchError(this.handleError));
  }

  // is jwt token expired
  private tokenExpired(token: string) {
    const expiry = localStorage.getItem('expires_at');
    if (expiry === '' || expiry === null) return false;
    return Math.floor(new Date().getTime() / 1000) >= +expiry;
  }
  // user log in status according to jwt expiration time
  public isUserLoggedIn(): Observable<boolean> {
    let jwt = localStorage.getItem('jwt');
    return of(jwt === '' || jwt === null ? false : !this.tokenExpired(jwt));
  }
  private setUser(authResult: ResponseModel) {
    let expiration = JSON.parse(atob(authResult.jwt.split('.')[1])).exp;
    localStorage.setItem('jwt', authResult.jwt);
    localStorage.setItem('expires_at', expiration);
    localStorage.setItem('user_id', authResult.id);
    localStorage.setItem('user_role', authResult.role);
  }
  private setUserId(authResult: ResponseModel) {
    localStorage.setItem('user_id', authResult.id);
  }
  private removeUser() {
    localStorage.clear();
  }

  private handleError(error: HttpErrorResponse) {
    let errorMsg = '';
    console.error('An error occurred:', error.error);

    // client side network error
    if (error.status === 0) errorMsg = 'Network error';
    else errorMsg = error.error.msg;

    return throwError(() => new Error(errorMsg));
  }
}
