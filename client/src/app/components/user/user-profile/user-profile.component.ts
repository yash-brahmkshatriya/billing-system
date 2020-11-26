import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserapiService } from '../../../services/userapi.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  updateform: FormGroup;
  toUpdate: Boolean = false;
  userInfo: any = [];
  public loading: boolean = true;
  public disableBtn: boolean = false;
  private fmsg;

  constructor(
    private userservice: UserapiService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private msgService: FlashMessagesService
  ) {}

  ngOnInit(): void {
    this.userservice.getProfile().subscribe((data) => {
      this.userInfo = data;
      this.loading = false;
    });
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params.fmsg) {
        this.msgService.show(params.fmsg, {
          cssClass: 'alert-success',
          timeout: 3000,
        });
      }
    });
    this.updateform = this.fb.group({
      email: [
        { value: this.userInfo['email'], disabled: true },
        [Validators.required],
      ],
      pfname: ['', [Validators.required, Validators.maxLength(100)]],
      plname: ['', [Validators.required, Validators.maxLength(100)]],
      company_name: ['', [Validators.required, Validators.maxLength(50)]],
      phn_no: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]+$'),
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      address: this.fb.group({
        place_no: ['', [Validators.required, Validators.maxLength(50)]],
        street: ['', [Validators.maxLength(100)]],
        locality: ['', [Validators.required, Validators.maxLength(100)]],
        city: ['', [Validators.required, Validators.maxLength(50)]],
        state: ['', [Validators.required, Validators.maxLength(50)]],
        pincode: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(6),
            Validators.pattern('^[0-9]+$'),
          ],
        ],
      }),
    });
    this.updateform.valueChanges.subscribe(() => {
      this.disableBtn = !this.updateform.valid;
    });
  }

  toggle(): void {
    this.toUpdate = !this.toUpdate;
    if (this.toUpdate) {
      this.updateform.patchValue({
        emailid: this.userInfo['email'],
        pfname: this.userInfo['pfname'],
        plname: this.userInfo['plname'],
      });
    }
  }

  get pfname() {
    return this.updateform.get('pfname');
  }
  get plname() {
    return this.updateform.get('plname');
  }
  get email() {
    return this.updateform.get('email');
  }
  get phn_no() {
    return this.updateform.get('phn_no');
  }
  get password() {
    return this.updateform.get('password');
  }
  get company_name() {
    return this.updateform.get('company_name');
  }
  get place_no() {
    return this.updateform.get('address').get('place_no');
  }
  get street() {
    return this.updateform.get('address').get('street');
  }
  get locality() {
    return this.updateform.get('address').get('locality');
  }
  get city() {
    return this.updateform.get('address').get('city');
  }
  get state() {
    return this.updateform.get('address').get('state');
  }
  get pincode() {
    return this.updateform.get('address').get('pincode');
  }

  updateToggle(): void {
    this.toUpdate = true;
    this.updateform.patchValue({
      email: this.userInfo['email'],
      pfname: this.userInfo['pfname'],
      plname: this.userInfo['plname'],
      company_name: this.userInfo['company_name'],
      phn_no: this.userInfo['phn_no'],
      address: this.userInfo['address'],
    });
  }

  showToggle(): void {
    this.toUpdate = false;
  }

  onSubmit() {
    if (!this.updateform.valid) {
      return false;
    } else {
      this.userservice
        .updateProfile(this.updateform.value)
        .subscribe((data) => {
          this.userInfo = data;
          console.log(this.userInfo);
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate(['/profile']);
        });
    }
  }
}
