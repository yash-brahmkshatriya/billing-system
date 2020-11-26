import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BillApiService } from '../../../services/bill-api.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FlashMessagesService } from 'angular2-flash-messages';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-create-bill',
  templateUrl: './create-bill.component.html',
  styleUrls: ['./create-bill.component.css'],
})
export class CreateBillComponent implements OnInit {
  billForm: FormGroup;
  today: any;
  lastBillDet: any;
  discountGiven: boolean = false;
  private bill_id: any;
  public loading: boolean = true;
  public disableBtn: boolean = true;
  public billMode: string;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private billservice: BillApiService,
    private fb: FormBuilder,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.iniUpdateForm();
    this.activatedRoute.queryParams.subscribe((params) => {
      this.loading = true;
      this.billMode = params.mode ? params.mode : 'create';
      this.bill_id = params.bill_id;
      if (this.billMode === 'edit') {
        this.fetchAndPatchForEditBill(this.bill_id);
        const billDateChanges$ = this.billForm.get('bill').get('date')
          .valueChanges;
        billDateChanges$.subscribe((bdate) => this.updateBillNum(bdate));
      } else if (this.billMode === 'fork') {
        this.fetchAndPatchForForkBill(this.bill_id);
        const billDateChanges$ = this.billForm.get('bill').get('date')
          .valueChanges;
        billDateChanges$.subscribe((bdate) => this.updateBillNum(bdate));
      } else {
        this.billForm.reset();
        this.fetchAndPatchForNewBill();
        const billDateChanges$ = this.billForm.get('bill').get('date')
          .valueChanges;
        billDateChanges$.subscribe((bdate) => this.updateBillNum(bdate));
      }
    });
    this.billForm.valueChanges.subscribe(() => {
      this.disableBtn = !this.billForm.valid;
    });
    const itemChanges$ = this.billForm.controls['items'].valueChanges;
    itemChanges$.subscribe((itemsData) => this.updateTotalAmt(itemsData));

    const discChanges$ = this.billForm.controls['discountPct'].valueChanges;
    discChanges$.subscribe((pct) => this.updateDiscountedPrice(pct));
  }

  fetchAndPatchForNewBill(): void {
    this.today = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.billservice.getLastBillDetails().subscribe((data) => {
      this.loading = false;
      this.lastBillDet = data;
      this.lastBillDet['bill']['date'] = this.today;
      this.lastBillDet['dc']['date'] = this.today;
      this.billForm.patchValue({
        bill: this.lastBillDet['bill'],
        dc: this.lastBillDet['dc'],
        po: {
          date: this.today,
        },
      });
    });
    this.addItem();
  }

  fetchAndPatchForEditBill(id: any): any {
    this.billservice.getBill(id).subscribe((bill_details) => {
      for (let i = 0; i < bill_details.items.length; i++) {
        this.addItem();
      }
      if (bill_details.discountPct > 0) this.toggleDiscount();
      bill_details.bill.date = this.formatDate(bill_details.bill.date);
      bill_details.dc.date = this.formatDate(bill_details.dc.date);
      bill_details.po.date = this.formatDate(bill_details.po.date);
      this.lastBillDet = bill_details;
      this.billForm.patchValue(bill_details, {
        onlySelf: true,
        emitEvent: false,
      });
      this.updateTotalAmt(this.billForm.get('items').value);
      this.loading = false;
    });
  }

  fetchAndPatchForForkBill(bill_id: any): void {
    this.today = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.billservice.getLastBillDetails().subscribe((data) => {
      this.lastBillDet = data;
      this.lastBillDet['bill']['date'] = this.today;
      this.lastBillDet['dc']['date'] = this.today;
      this.billForm.patchValue({
        bill: this.lastBillDet['bill'],
        dc: this.lastBillDet['dc'],
        po: {
          date: this.today,
        },
      });
      this.billservice.getBill(bill_id).subscribe((bill_details) => {
        for (let i = 0; i < bill_details.items.length; i++) {
          this.addItem();
        }
        if (bill_details.discountPct > 0) this.toggleDiscount();
        this.billForm.patchValue(
          {
            party_name: bill_details.party_name,
            items: bill_details.items,
            discountPct: bill_details.discountPct,
            roundoff: bill_details.roundoff,
            total_amt: bill_details.total_amt,
            disc_amt: bill_details.disc_amt,
            grand_total: bill_details.grand_total,
          },
          { onlySelf: true, emitEvent: false }
        );
        this.updateTotalAmt(this.billForm.get('items').value);
        this.loading = false;
      });
    });
  }

  private formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

  iniUpdateForm() {
    this.billForm = this.fb.group({
      party_name: ['', [Validators.required, Validators.maxLength(255)]],
      bill: this.fb.group({
        num: [''],
        date: [''],
      }),
      dc: this.fb.group({
        num: [''],
        date: [''],
      }),
      po: this.fb.group({
        num: [''],
        date: [''],
      }),
      items: this.fb.array([]),
      total_amt: [0],
      disc_amt: [0],
      grand_total: [0],
      roundoff: [0],
      discountPct: [
        0,
        [
          Validators.pattern('^[0-9]+(.[0-9]{1,3})?$'),
          Validators.min(0),
          Validators.max(100),
        ],
      ],
    });
  }

  get billform() {
    return this.billForm.controls;
  }
  get party_name() {
    return this.billForm.get('party_name');
  }
  get bill() {
    return this.billForm.get('bill');
  }
  get dc() {
    return this.billForm.get('dc');
  }
  get po() {
    return this.billForm.get('po');
  }
  get items() {
    return this.billForm.get('items');
  }
  get total_amt() {
    return this.billForm.get('total_amt');
  }
  get disc_amt() {
    return this.billForm.get('disc_amt');
  }
  get grand_total() {
    return this.billForm.get('grand_total');
  }
  get roundoff() {
    return this.billForm.get('roundoff');
  }
  get discountPct() {
    return this.billForm.get('discountPct');
  }

  updateBillNum(bdate: Date): void {
    this.loading = true;
    this.billservice.getNextBillDetails(bdate).subscribe((data) => {
      this.billForm.patchValue({
        bill: {
          num: data['billno'],
        },
        dc: {
          num: data['dcno'],
        },
      });
      this.lastBillDet['bill']['num'] = data['billno'];
      this.lastBillDet['dc']['num'] = data['dcno'];
      this.loading = false;
    });
  }

  addItemGrp(): FormGroup {
    return this.fb.group({
      description: ['', [Validators.required, Validators.maxLength(255)]],
      rate: ['', [Validators.required]],
      qty: ['', [Validators.required]],
      amt: ['', [Validators.required]],
      unit: ['Nos.', [Validators.required, Validators.maxLength(10)]],
      per_unit: ['1', [Validators.required]],
    });
  }

  addItem(): void {
    (<FormArray>this.billForm.get('items')).push(this.addItemGrp());
  }

  removeItem(idx: number) {
    (<FormArray>this.billForm.get('items')).removeAt(idx);
  }

  updateTotalAmt(items: any) {
    const itemCtrl = this.billForm.get('items') as FormArray;
    let totalSum = 0;
    for (let i in items) {
      let amt = (items[i].qty * items[i].rate) / items[i].per_unit;
      itemCtrl
        .at(+i)
        .get('amt')
        .setValue(Number(amt.toFixed(2)), { onlySelf: true, emitEvent: false });
      totalSum += amt;
    }
    this.billForm.get('total_amt').setValue(totalSum.toFixed(2));
    this.updateDiscountedPrice(this.billForm.get('discountPct').value);
  }

  updateDiscountedPrice(pct: any) {
    const initotal = this.billForm.get('total_amt').value;
    let disc_amt = initotal * (pct / 100);
    this.billForm.get('disc_amt').setValue(Number(disc_amt.toFixed(2)));
    this.updateGrandTotal();
  }

  updateGrandTotal(): void {
    let disc_amt: number = this.billForm.get('disc_amt').value;
    let total_amt: number = this.billForm.get('total_amt').value;
    let grandtotal = Math.round(total_amt - disc_amt);
    let roundoff = Number((grandtotal - total_amt + disc_amt).toFixed(2));
    this.billForm.get('roundoff').setValue(roundoff);
    this.billForm.get('grand_total').setValue(grandtotal);
  }

  toggleDiscount(): void {
    this.discountGiven = !this.discountGiven;
    this.billForm.get('discountPct').setValue(0);
  }

  onsubmit() {
    if (!this.billForm.valid) {
      return false;
    } else {
      if (this.billMode === 'edit') {
        this.billservice
          .editBill(this.billForm.value, this.bill_id)
          .subscribe((success) => {
            this.router.navigate([`/bills/show/${this.bill_id}`]);
          });
      } else {
        this.billservice.postBill(this.billForm.value).subscribe((success) => {
          console.log(success);
          this.router.navigate(['/bills/show'], {
            queryParams: { cancelled: false },
          });
        });
      }
    }
  }
}
