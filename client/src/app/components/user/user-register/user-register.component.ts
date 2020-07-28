import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserapiService } from '../../../services/userapi.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})
export class UserRegisterComponent implements OnInit {

  signupform:FormGroup;
  disableBtn:boolean = true;

  constructor(
    private userservice:UserapiService,
    private router:Router,
    private fb:FormBuilder,
    private flashMsgService:FlashMessagesService
  ) { }

  ngOnInit(): void {
    this.signupform = this.fb.group({
      email:['',[Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      pfname:['',[Validators.required,Validators.maxLength(100)]],
      plname:['',[Validators.required,Validators.maxLength(100)]],
      company_name:['',[Validators.required,Validators.maxLength(50)]],
      phn_no:['',[Validators.required,Validators.pattern("^[0-9]+$"),Validators.minLength(10),Validators.maxLength(10)]],
      address:this.fb.group({
        place_no:['',[Validators.required,Validators.maxLength(50)]],
        street:['',[Validators.maxLength(50)]],
        locality:['',[Validators.required,Validators.maxLength(50)]],
        city:['',[Validators.required,Validators.maxLength(50)]],
        state:['',[Validators.required,Validators.maxLength(50)]],
        pincode:['',[Validators.required,Validators.pattern("^[0-9]+$"),Validators.minLength(6),Validators.maxLength(6)]]
      }),
      password:['',[Validators.required,Validators.minLength(8),Validators.maxLength(255)]]
    })
    this.signupform.valueChanges.subscribe(() => {
      this.disableBtn = !this.signupform.valid;
    })
  }

  get signupForm(){return this.signupform.controls;}
  get pfname(){return this.signupform.get('pfname');}
  get plname(){return this.signupform.get('plname');}
  get email(){return this.signupform.get('email');}
  get phn_no(){return this.signupform.get('phn_no');}
  get password(){return this.signupform.get('password');}
  get company_name(){return this.signupform.get('company_name');}
  get place_no(){return this.signupform.get('address').get('place_no');}
  get street(){return this.signupform.get('address').get('street');}
  get locality(){return this.signupform.get('address').get('locality');}
  get city(){return this.signupform.get('address').get('city');}
  get state(){return this.signupform.get('address').get('state');}
  get pincode(){return this.signupform.get('address').get('pincode');}

  onSubmit() {
    if(!this.signupform.valid){console.log('invalid');return false;}
    else {
      this.userservice.register(this.signupform.value).subscribe(
        (done) => {
          if(done.success==true){
            console.log('success')
            // this.flashMsgService.show('Registered Successfully. Please Login to proceed',{cssClass:'alert-success',timeout:3000})
            // this.router.navigateByUrl('/dashboard')
            this.router.navigate(['/login'],{queryParams:{registered:true}});            
          } else {
            console.log('failed');
            this.flashMsgService.show(done.message,{cssClass:'alert-warning',timeout:3000})
          }
        },(err) => {
          console.log(err);
        }
      )
    }
  }
}
