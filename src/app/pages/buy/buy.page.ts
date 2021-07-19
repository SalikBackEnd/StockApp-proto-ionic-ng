
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Tables, TransactionType } from 'src/app/services/helper.service';

import { LocalService } from 'src/app/services/local.service';
import { ToastService } from 'src/app/services/toast.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-buy',
  templateUrl: './buy.page.html',
  styleUrls: ['./buy.page.scss'],
})
export class BuyPage implements OnInit {

  public Trans = {
    id: 0,
    scriptid: "",
    quantity: 0,
    price: 0,
    date: Date.now(),
    statusid: 0
  }
  textQty: string = '';
  textPrice: string = '';
  Tax: any = false;
  public logList: any = [];
  public logarr = [];
  scripts: any = [];
  public Quantity: number = 0;
  public Amount: number = 0;
  public page = 'buy';




  constructor(public local: LocalService, public toast: ToastService, public loadingController: LoadingController) {
    this.addScriptstoSelect();

  }

  ngOnInit() {
  }
  addScriptstoSelect() {
    this.local.GetScripts().subscribe(res => {

      this.scripts = res;
    }, err => {
      console.log(err)
    });
    console.log("Buy page")
    console.log(this.scripts)
  }

  async onBuy() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 1500
    });
    await loading.present();
    if (this.SetBuyData()) {
      this.Trans = {
        id: 0,
        scriptid: "",
        quantity: 0,
        price: 0,
        date: Date.now(),
        statusid: 0
      }
      this.ResetFields();
      loading.onDidDismiss().then(() => {
        this.toast.show("Transaction done successfully!");
      });

    }
    else {
      loading.dismiss();
      this.toast.show("Please fill all the fields.");
    }
  }

  SetBuyData() {
    let key = Tables.Transaction;
    if (this.isBuyValid()) {
      this.logList = this.local.GetData(key);
      if (this.logList != undefined) {

        this.Trans.id = this.local.GenerateId(key);
        this.Trans.statusid = TransactionType.Buy;
        this.Trans.date = Date.now();
        this.logList.push(this.Trans);
        this.local.SetData(key, this.logList);
        return true;
      } else {
        this.Trans.id = this.local.GenerateId(key);
        this.Trans.statusid = TransactionType.Buy;
        this.Trans.date = Date.now();
        let arr: any = [];
        arr.push(this.Trans);
        this.local.SetData(key, arr);
        return true;
      }
    } else {
      return false;
    }

  }
  isBuyValid() {
    let valid = true;
    if (this.Trans.scriptid == "") {
      valid = false;
    }
    if (this.Trans.quantity == 0) {
      valid = false;
    }
    if (this.Trans.price == 0) {
      valid = false;
    }
    if (this.Trans.price < 0) {
      valid = false;
    }
    if (this.Trans.quantity < 0) {
      valid = false;
    }
    return valid;
  }
  onQuantityInput(value) {
    let v = parseInt(value);
    if (v > 0) {
      this.Quantity = v;
      this.Trans.quantity = v;
    }
    else {
      this.toast.show("Enter a valid Quantity!");
      this.Quantity = 0;
      this.Trans.quantity = 0;
    }
  }
  onAmountInput(value) {
    let v = parseFloat(value);
    if (v > 0) {
      this.Amount = v;
      this.Trans.price = v;
    }
    else {
      this.toast.show("Enter a valid Amount!");
      this.Amount = 0;
      this.Trans.price = 0;
    }
  }
  onCheck() {
    this.local.onIncludeTaxCheck(this.Tax, this.toast);
  }
  ResetFields() {
    this.textQty = null;
    this.textPrice = null;
    this.Quantity = 0;
    this.Amount = 0;
    this.Trans.quantity = 0;
    this.Trans.price = 0;
  }

}
