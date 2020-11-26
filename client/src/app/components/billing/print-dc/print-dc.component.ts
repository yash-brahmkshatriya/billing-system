import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BillApiService } from '../../../services/bill-api.service';
import { UserapiService } from '../../../services/userapi.service';

@Component({
  selector: 'app-print-dc',
  templateUrl: './print-dc.component.html',
  styleUrls: ['./print-dc.component.css'],
})
export class PrintDcComponent implements OnInit {
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
