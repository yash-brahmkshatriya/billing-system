import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { UserapiService } from '../../../services/userapi.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {

  loginform:FormGroup;
  disableBtn:boolean = true;

  constructor(
    private router:Router,
    private userservice:UserapiService,
    private fb:FormBuilder,
    private flashMsgService:FlashMessagesService,
    private activatedRoute:ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loginform = this.fb.group({
      email:['',[Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      password:['',Validators.required]
    })
    this.activatedRoute.queryParams.subscribe(params => {
      if(params.registered){
        this.flashMsgService.show('Registered Successfully. Login to Continue',{cssClass:'alert-success',timeout:5000})
      }
    })
    this.loginform.valueChanges.subscribe(() => {
      this.disableBtn = !this.loginform.valid;
    })
  }

  get loginForm(){return this.loginform.controls;}

  onSubmit(){
    if(!this.loginform.valid){return false;}
    else {
      this.userservice.login(this.loginform.value).subscribe(
        (data) => {
          if(!data.message){
            console.log('Successfull login')
            this.router.navigateByUrl('/dashboard')
          } else {
            this.flashMsgService.show(data.message,{cssClass:'alert-danger',timeout:2000});
          }
        },(err) => {
          console.log(err);
        }
      )
    }
  }
}
