import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BillApiService } from '../../../services/bill-api.service';
import { UserapiService } from '../../../services/userapi.service';
declare const inWords: any;

@Component({
  selector: 'app-print-bill',
  templateUrl: './print-bill.component.html',
  styleUrls: ['./print-bill.component.css'],
})
export class PrintBillComponent implements OnInit {
  private billID: string;
  public currBill: any;
  public userDet: any;
  public discountGiven: boolean = false;
  public amtInWords: string;
  public loadingBill: boolean = true;
  public loadingProfile: boolean = true;
  public spaceRequired: number;
  public spaceClass: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private billservice: BillApiService,
    private userservice: UserapiService
  ) {}

  ngOnInit(): void {
    this.billID = this.activatedRoute.snapshot.paramMap.get('id');
    this.billservice.getBill(this.billID).subscribe((data) => {
      this.loadingBill = false;
      this.currBill = data;
      this.spaceRequired = 7 - this.currBill['items'].length;
      this.spaceClass = `space-${this.spaceRequired}`;
      this.amtInWords = inWords(this.currBill['grand_total']);
      let totamt = 0,
        disc_amt = 0;
      for (let i = 0; i < this.currBill['items'].length; i++) {
        totamt += this.currBill['items'][i]['amt'];
        this.currBill['items'][i]['amt'] = this.currBill['items'][i][
          'amt'
        ].toFixed(2);
      }
      disc_amt = totamt * (this.currBill['discountPct'] / 100);
      this.currBill['tot_amt'] = Number(totamt.toFixed(2));
      this.currBill['disc_amt'] = Number(disc_amt.toFixed(2));
      this.currBill['grand_total'] = Number(
        this.currBill['grand_total'].toFixed(2)
      );
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
    this.userservice.getProfile().subscribe((data) => {
      this.loadingProfile = false;
      this.userDet = data;
      this.userDet['addressString'] = this.userDet['address']['place_no'];
      this.userDet['addressString'] += ', ' + this.userDet['address']['street'];
      this.userDet['addressString'] +=
        ', ' + this.userDet['address']['locality'];
      this.userDet['addressString'] += ', ' + this.userDet['address']['city'];
      this.userDet['addressString'] +=
        ', ' + this.userDet['address']['pincode'];
    });
  }
}
