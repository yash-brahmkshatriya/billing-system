import { Injectable } from '@angular/core';
import { Observable, throwError, from, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class UserapiService {
  prodURL: string = `http://localhost:8000`;
  deployUrl: string = ``;
  baseURL: string = `${this.deployUrl}/api/user`;
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  private token: string = null;
  private tokenBehaviour: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public tokenObs: Observable<boolean> = this.tokenBehaviour.asObservable();

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {}

  private setToken(token): void {
    localStorage.setItem('auth-token', token);
    this.token = token;
    this.tokenBehaviour.next(true);
  }

  private getToken(): any {
    if (!this.token) {
      this.token = localStorage.getItem('auth-token');
      if (this.token && !this.jwtHelper.isTokenExpired(this.token)) {
        this.tokenBehaviour.next(true);
      }
    }
    return this.token;
  }

  private deleteToken(): void {
    localStorage.removeItem('auth-token');
    this.token = null;
    this.tokenBehaviour.next(false);
  }

  isLoggedIn() {
    var token = this.getToken();
    if (this.jwtHelper.isTokenExpired(token)) {
      this.deleteToken();
      return false;
    }
    return true;
  }

  // register user
  register(data): Observable<any> {
    let cururl = `${this.baseURL}/register`;
    return this.http.post(cururl, data).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

  // login user
  login(data): Observable<any> {
    let cururl = `${this.baseURL}/login`;
    return this.http.post(cururl, data).pipe(
      map((res: Response) => {
        if (!res['message']) {
          this.setToken(res['token']);
        }
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

  // logout user
  logout() {
    this.deleteToken();
    this.tokenBehaviour.next(false);
  }

  // user data
  getProfile() {
    let cururl = `${this.baseURL}/profile`;
    return this.http.get(cururl);
  }

  // update profile
  updateProfile(newdata): Observable<any> {
    let cururl = `${this.baseURL}/update`;
    return this.http.put(cururl, newdata).pipe(catchError(this.errorMgmt));
  }

  changePwd(newdata): Observable<any> {
    let cururl = `${this.baseURL}/changePwd`;
    return this.http.put(cururl, newdata).pipe(
      map((res: Response) => {
        return res;
      }),
      catchError(this.errorMgmt)
    );
  }

  // error management
  errorMgmt(error: HttpErrorResponse) {
    let errmsg = '';
    if (error.error instanceof ErrorEvent) {
      errmsg = error.error.message;
    } else {
      errmsg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errmsg);
  }
}
