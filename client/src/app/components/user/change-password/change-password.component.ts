import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserapiService } from '../../../services/userapi.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  public updatePwdForm:FormGroup;
  public pwdsMatch:boolean = true;
  public disableBtn:boolean = true;

  constructor(
    private router:Router,
    private fb:FormBuilder,
    private userservice:UserapiService,
    private msgService:FlashMessagesService
  ) { }

  ngOnInit(): void {
    this.updatePwdForm = this.fb.group({
      password:['',[Validators.required]],
      newpassword:['',[Validators.required,Validators.minLength(8),Validators.maxLength(255)]],
      newpwdrepeat:['',[Validators.required]]
    })
    this.newpwd.valueChanges.subscribe((val) => {
      this.pwdsMatch = (this.newpwd.value == this.newpwdrepeat.value);
    })
    this.newpwdrepeat.valueChanges.subscribe((val) => {
      this.pwdsMatch = this.newpwd.value == this.newpwdrepeat.value;
    })
    this.updatePwdForm.valueChanges.subscribe(() => {
      this.disableBtn = !this.updatePwdForm.valid || !this.pwdsMatch;
    })
  }

  get pwd(){return this.updatePwdForm.get('password');}
  get newpwd(){return this.updatePwdForm.get('newpassword');}
  get newpwdrepeat(){return this.updatePwdForm.get('newpwdrepeat');}

  toProfile(){
    this.router.navigateByUrl('/profile');
  }

  onSubmit(){
    if(!this.updatePwdForm.valid){return false;}
    else {
      this.userservice.changePwd(this.updatePwdForm.value).subscribe(
        (data) => {
          if(data['success']){
            this.router.navigate(['/profile'],{queryParams:{fmsg:'Password Updated'}});
            // this.msgService.show('Password Updated',{cssClass:'alert-success',timeout:2000})
          } else if(data['msg']){
            this.msgService.show(data['msg'],{cssClass:'alert-danger',timeout:2000})
          }
        },(err) => {
          console.log(err);
        }
      )
    }
  }

}
