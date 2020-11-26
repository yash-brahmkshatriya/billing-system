import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BillApiService } from '../../../services/bill-api.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-all-bills',
  templateUrl: './all-bills.component.html',
  styleUrls: ['./all-bills.component.css'],
})
export class AllBillsComponent implements OnInit {
  public billDetails: any;
  public loading: boolean = true;
  public cancelledReq: boolean;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private billservice: BillApiService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.loading = true;
      this.cancelledReq = params.cancelled
        ? params.cancelled === 'true'
          ? true
          : false
        : undefined;
      this.getAppropriateData();
    });
  }

  getAppropriateData() {
    // not empty
    if (this.cancelledReq === false || this.cancelledReq === true) {
      this.billservice
        .getParticularBills(this.cancelledReq)
        .subscribe((data) => {
          this.billDetails = data;
          this.loading = false;
        });
    } else {
      this.billservice.getAllBills().subscribe((data) => {
        this.billDetails = data;
        this.loading = false;
      });
    }
  }

  showBill(bill): void {
    this.router.navigate(['/bills/show', bill._id]);
  }
}
