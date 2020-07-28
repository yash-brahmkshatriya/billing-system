import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserapiService } from '../../../services/userapi.service';
import { BillApiService } from '../../../services/bill-api.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  noOfBills:Number = 0;
  public loading:boolean = true;
  constructor(
    private router:Router,
    private userservice:UserapiService,
    private billservice:BillApiService
  ) { }

  ngOnInit(): void {
    this.billservice.getCountOfBills().subscribe(data => {
      this.loading = false;
      this.noOfBills = data['count']
      console.log(data);
    });
  }
  toCreateBill(): void {
    this.router.navigateByUrl('/bills/create')
  }
  toShowBill(): void {
    this.router.navigateByUrl('/bills/show')
  }
}
