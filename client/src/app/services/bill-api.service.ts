import { Injectable } from '@angular/core';
import { Observable, throwError, from, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BillApiService {
  prodURL: string = `http://localhost:8000`;
  deployUrl: string = ``;
  baseURL: string = `${this.prodURL}/api/bill`;
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  private token: string;

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('auth-token');
  }

  getCountOfBills(): Observable<any> {
    let cururl = `${this.baseURL}/billcnt`;
    return this.http.get(cururl);
  }

  getBill(id): Observable<any> {
    let cururl = `${this.baseURL}/${id}`;
    return this.http.get(cururl);
  }

  getAllBills(): Observable<any> {
    let cururl = `${this.baseURL}/bills`;
    return this.http.get(cururl);
  }

  getParticularBills(cancelled): Observable<any> {
    let cururl = `${this.baseURL}/bills/${cancelled}`;
    return this.http.get(cururl);
  }

  getNextBillDetails(bill_date): Observable<any> {
    let cururl = `${this.baseURL}/nextbilldet/${bill_date}`;
    return this.http.get(cururl);
  }
  getLastBillDetails(): Observable<any> {
    let cururl = `${this.baseURL}/lastbilldet`;
    return this.http.get(cururl);
  }

  postBill(billdata): Observable<any> {
    let cururl = `${this.baseURL}/create`;
    return this.http.post(cururl, billdata).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

  cancelBill(cancelData, bid): Observable<any> {
    let cururl = `${this.baseURL}/cancel/${bid}`;
    return this.http.put(cururl, cancelData).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

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
