import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BillApiService } from '../../../services/bill-api.service';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-show-bill',
  templateUrl: './show-bill.component.html',
  styleUrls: ['./show-bill.component.css'],
})
export class ShowBillComponent implements OnInit {
  private billID: string;
  public currBill: any;
  public discountGiven: boolean = false;
  public loading: boolean = true;
  public cancelMenu: boolean = false;
  public cancelForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private billservice: BillApiService
  ) {}

  ngOnInit(): void {
    this.billID = this.activatedRoute.snapshot.paramMap.get('id');
    this.billservice.getBill(this.billID).subscribe((data) => {
      this.loading = false;
      this.currBill = data;
      let totamt = 0,
        disc_amt = 0;
      for (let i = 0; i < this.currBill['items'].length; i++) {
        totamt += this.currBill['items'][i]['amt'];
      }
      disc_amt = Number(
        (totamt * (this.currBill['discountPct'] / 100)).toFixed(2)
      );
      this.currBill['tot_amt'] = totamt;
      this.currBill['disc_amt'] = disc_amt;
      if (this.currBill['discountPct'] > 0) {
        this.discountGiven = true;
      }
      this.currBill['roundoff'] = Number(
        (
          this.currBill['grand_total'] -
          this.currBill['tot_amt'] +
          this.currBill['disc_amt']
        ).toFixed(2)
      );
    });
    this.iniCancelForm();
  }

  iniCancelForm() {
    this.cancelForm = this.fb.group({
      cancelled: [true],
      cancel_reason: [''],
    });
  }

  printBill(): void {
    this.router.navigate(['bills/print', this.billID]);
  }
  printDC(): void {
    this.router.navigate(['bills/print-dc', this.billID]);
  }

  toggleCancelMenu(): void {
    this.cancelMenu = !this.cancelMenu;
  }

  cancelBill() {
    console.log(this.cancelForm.value);
    this.billservice
      .cancelBill(this.cancelForm.value, this.billID)
      .subscribe((data) => {
        this.router.navigate(['/bills/show']);
      });
  }
}
