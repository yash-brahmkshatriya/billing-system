import { Component, OnInit } from '@angular/core';
import { UserapiService } from '../../services/userapi.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  loggedIn:any = false;
  fname:any;
  constructor(
    private userService:UserapiService,
    private router:Router) {
    this.userService.tokenObs.subscribe(what =>{
      this.loggedIn = what;
      if(this.loggedIn){
        this.userService.getProfile().subscribe(value => {
          this.fname = value['pfname'];
        })
      }
    })
  }
  
  ngOnInit(): void {
  }

  logout() {
    // this.userService.logout().subscribe(done => {
    //   if(done['success']){this.router.navigateByUrl('/');}
    //   else console.log('logout failed');
    // })
    this.userService.logout();
  }

}
