import { Injectable } from '@angular/core';
import { HttpRequest,HttpHandler,HttpEvent,HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor{

  constructor( ) { }
  
  intercept(request:HttpRequest<any>, next:HttpHandler) : Observable<HttpEvent<any>> {
    var token = localStorage.getItem('auth-token');
    if(token){
      request = request.clone({
        setHeaders: {
          Authorization: localStorage.getItem('auth-token')
        }
      });
    }

    return next.handle(request);
  }
}
