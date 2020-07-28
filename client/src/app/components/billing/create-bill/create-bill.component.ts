import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BillApiService } from '../../../services/bill-api.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FlashMessagesService } from 'angular2-flash-messages';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-create-bill',
  templateUrl: './create-bill.component.html',
  styleUrls: ['./create-bill.component.css']
})
export class CreateBillComponent implements OnInit {

  billForm:FormGroup;
  today:any;
  lastBillDet:any;
  discountGiven:boolean = false;
  public loading:boolean = true;
  public disableBtn:boolean = true;


  constructor(
    private router:Router,
    private billservice:BillApiService,
    private fb:FormBuilder,
    private datePipe:DatePipe
  ) { }

  ngOnInit(): void {
    this.today = this.datePipe.transform(new Date(),'yyyy-MM-dd');
    this.billservice.getLastBillDetails().subscribe(data => {
      this.loading = false;
      this.lastBillDet = data;
      this.lastBillDet['bill']['date'] = this.today;
      this.lastBillDet['dc']['date'] = this.today;
      this.billForm.patchValue({
          'bill':this.lastBillDet['bill'],
          'dc':this.lastBillDet['dc'],
          'po':{
            'date':this.today
          }
        })
    })
    this.iniUpdateForm();
    this.addItem();
    this.billForm.valueChanges.subscribe(() => {
      this.disableBtn = !this.billForm.valid;
    })
    
    const itemChanges$ = this.billForm.controls['items'].valueChanges;
    itemChanges$.subscribe(itemsData => this.updateTotalAmt(itemsData));

    const discChanges$ = this.billForm.controls['discountPct'].valueChanges;
    discChanges$.subscribe(pct => this.updateDiscountedPrice(pct));

    const billDateChanges$ = this.billForm.get('bill').get('date').valueChanges;
    billDateChanges$.subscribe(bdate => this.updateBillNum(bdate));
  }

  iniUpdateForm() {
    this.billForm = this.fb.group({
      party_name:['',[Validators.required,Validators.maxLength(255)]],
      bill:this.fb.group({
        num:[''],
        date:['']
      }),
      dc:this.fb.group({
        num:[''],
        date:['']
      }),
      po:this.fb.group({
        num:[''],
        date:['']
      }),
      items:this.fb.array([]),
      total_amt:[0],
      disctotal:[0],
      grand_total:[0],
      roundoff:[0],
      discountPct:[0,[Validators.pattern("^[0-9]+(\.[0-9]{1,3})?$"),Validators.min(0),Validators.max(100)]]
    })
  }

  get billform(){
    return this.billForm.controls;
  }
  get party_name(){return this.billForm.get('party_name');}
  get bill(){return this.billForm.get('bill');}
  get dc(){return this.billForm.get('dc');}
  get po(){return this.billForm.get('po');}
  get items(){return this.billForm.get('items');}
  get total_amt(){return this.billForm.get('tot_amt');}
  get disctotal(){return this.billForm.get('disctotal');}
  get grand_total(){return this.billForm.get('grand_total');}
  get roundoff(){return this.billForm.get('roundoff');}
  get discountPct(){return this.billForm.get('discountPct');}


  updateBillNum(bdate:Date): void {
    this.loading = true;
    this.billservice.getNextBillDetails(bdate).subscribe(data => {
      this.billForm.patchValue({
        'bill':{
          'num':data['billno'],
        },
        'dc':{
          'num':data['dcno']
        }
      })
      this.lastBillDet['bill']['num'] = data['billno']
      this.lastBillDet['dc']['num'] = data['dcno']
      this.loading = false;
    })
  }

  addItemGrp() : FormGroup {
    return this.fb.group({
      // grpidx:[''],
      description:['',[Validators.required,Validators.maxLength(255)]],
      rate:['',[Validators.required]],
      qty:['',[Validators.required]],
      amt:['',[Validators.required]]
    });
  }

  addItem():void {
    (<FormArray>this.billForm.get('items')).push(this.addItemGrp());
  }

  removeItem(idx:number){
    (<FormArray>this.billForm.get('items')).removeAt(idx);
  }

  updateTotalAmt(items:any) {
    const itemCtrl = this.billForm.get('items') as FormArray;
    let totalSum = 0;
    for(let i in items) {
      const amt = items[i].qty * items[i].rate;
      itemCtrl.at(+i).get('amt').setValue(amt.toFixed(2),{onlySelf:true,emitEvent:false});
      totalSum+=amt;
    }
    this.billForm.get('total_amt').setValue(totalSum.toFixed(2));
    this.updateDiscountedPrice(this.billForm.get('discountPct').value);
  }

  updateDiscountedPrice(pct:any) {
    const initotal = this.billForm.get('total_amt').value;
    let disctotal = initotal * (1-pct/100);
    this.billForm.get('disctotal').setValue(disctotal.toFixed(2));
    this.updateGrandTotal();
  }

  updateGrandTotal():void {
    let disctotal = this.billForm.get('disctotal').value;
    let grandtotal = Math.round(disctotal);
    this.billForm.get('roundoff').setValue((grandtotal-disctotal).toFixed(2));
    this.billForm.get('grand_total').setValue(grandtotal);
  }

  toggleDiscount(): void {
    this.discountGiven = !this.discountGiven;
    this.billForm.get('discountPct').setValue(0);
  }

  onsubmit() {
    if(!this.billForm.valid){return false;}
    else {
      console.log(this.billForm.value);
      this.billservice.postBill(this.billForm.value).subscribe(success => {
        console.log(success);
        this.router.navigate(['/bills/show'],{queryParams:{cancelled:false}})
      })
    }
  }
}
