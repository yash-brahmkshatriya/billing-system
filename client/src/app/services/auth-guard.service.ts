import { Injectable } from '@angular/core';
import { Router,CanActivate } from '@angular/router';
import { UserapiService } from './userapi.service'

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private userService:UserapiService,
    private router:Router
  ) { }

  canActivate() {
    if(!this.userService.isLoggedIn()){
      this.router.navigateByUrl('/login');
      return false;
    }
    return true;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ForwardAuthGuardService implements CanActivate {
  constructor(
    private userService:UserapiService,
    private router:Router
  ) {}

  canActivate() {
    if(this.userService.isLoggedIn()){
      this.router.navigateByUrl('/dashboard');
      return false;
    }
    return true;
  }
}