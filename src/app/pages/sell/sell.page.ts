import { Component, ElementRef, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { LocalService } from 'src/app/services/local.service';
import { ToastService } from 'src/app/services/toast.service';

import { TransactionType, HelperService, Tables } from 'src/app/services/helper.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-sell',
  templateUrl: './sell.page.html',
  styleUrls: ['./sell.page.scss'],
})
export class SellPage implements OnInit {

  public Trans = {
    id: 0,
    scriptid: "",
    quantity: 0,
    price: 0,
    date: Date.now(),
    tax:0,
    comission:0,
    totalcost:0,
    statusid: 0
  }
  textQty: string = '';
  textPrice: string = '';
  public Quantity: number = 0;
  public Amount: number = 0;
  public page = 'sell';
  public scripts: any = [];
  Tax: any = false;

  public selectedScriptid: string="0";
  public selectedScript:number;
  buyList: any = [];
  sellList: any = [];
  logarr: any = [];
  tax: number=0;
  comission: number=0;
  totalcost: number=0;
  public resetscript:boolean=false;
  constructor(public local: LocalService, public toast: ToastService, public helper: HelperService, public loadingController: LoadingController) {
    // this.addScriptstoSelect();
  }

  ngOnInit() {
    this.local.countTotalShares();
  }
  ngOnChanges(changes: SimpleChanges) {

  }
  ionViewWillEnter() {
    // this.addScriptstoSelect();
    this.local.countTotalShares();
  }
  // onScriptSelect(value) {
  //   if (value != "") {
  //     this.selectedScriptid = parseInt(value);
  //     console.log(this.selectedScriptid)
  //   }
  // }

  addScriptstoSelect() {
    this.local.GetScripts().subscribe(res => {

      this.scripts = res;
    }, err => {
      console.log(err)
    });
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
  Sell(scriptid) {

    if (this.isSellValid()) {
      let buyAmount = 0; let buyTotal = 0; let sellAmount = 0; let sellTotal = 0;
      let totalQunatity = 0; let totalAmount = 0; let buyQuantity: any; let buyprice: any;
      let sellQuantity: any; let sellprice: any; let key = Tables.Transaction;
      let list = this.local.GetData(key);
      if (list != undefined) {
        // this.buyList=list.filter((e,i)=>{return e.id!="" && e.statusid== TransactionType.Buy && e.scriptid==scriptid});
        // this.buyList = this.local.scriptsBuyList(scriptid);
        // this.sellList=list.filter(e=>{return e.id!="" && e.statusid==TransactionType.Sell && e.scriptid==scriptid});
        // this.sellList = this.local.scriptsSellList(scriptid);
        // if(this.buyList.length>0){
        //   buyQuantity=this.buyList.map(a=>a.quantity);
        //   buyprice=this.buyList.map(a=>a.price);
        // }

        // if(this.sellList.length>0){
        //   sellQuantity=this.sellList.map(a=>a.quantity);
        //   sellprice=this.sellList.map(a=>a.price);
        // }

        // if (this.buyList.length > 0) {
        //   buyQuantity = this.buyList.map(a => a.quantity).reduce((a, b) => a + b, 0);
        //   buyprice = this.buyList.map(a => a.price).reduce((a, b) => a + b, 0);
        //   buyAmount = buyQuantity * buyprice;
        //   buyTotal = buyQuantity;
        // }
        // // else if(this.buyList.length==1){
        // //   buyAmount=buyQuantity*buyprice;
        // //   buyTotal=buyQuantity;
        // // }
        // if (this.sellList.length > 0) {
        //   sellQuantity = this.sellList.map(a => a.quantity).reduce((a, b) => a + (b || 0), 0);
        //   sellprice = this.sellList.map(a => a.price).reduce((a, b) => a + (b || 0), 0);
        //   sellAmount = sellQuantity * sellprice;
        //   sellTotal = sellQuantity;
        // }
        // else if(this.sellList.length==1){
        //   sellAmount=sellQuantity*sellprice;
        //   sellTotal=sellQuantity;
        // }
        totalAmount = this.helper.scriptTotalAmount(scriptid);
        totalQunatity = this.helper.scriptTotalQuantity(scriptid);
        if (this.Trans.quantity > totalQunatity) {
          this.toast.show("Not enough qunatity in inventory.");
          return;
        } else if (this.Trans.quantity <= totalQunatity) {

          this.Trans.statusid = TransactionType.Sell;
          this.Trans.scriptid=this.selectedScriptid;
          this.Trans.id = this.local.GenerateId(key);
          this.Trans.date = Date.now();
          if (this.Tax == false) {
            this.Trans.tax = 0;
            this.Trans.comission = 0;
            this.Trans.totalcost = (this.totalcost - this.tax) - this.comission;
          } else if (this.Tax == true) {
            this.Trans.tax = this.tax;
            this.Trans.comission = this.comission;
            this.Trans.totalcost = this.totalcost;
          }
          list.push(this.Trans);
          this.local.SetData(key, list);

          return true;
        } else {
          this.toast.show("Somthing Went Wrong!");
          return false;
        }
      } else {
        this.toast.show("No Inventory Available.");
        return false;
      }
    } else {
     
      return false;
    }
  }
  isSellValid() {
    let valid = true;
    if (this.selectedScriptid == "" || this.selectedScriptid=="0") {
      this.toast.show("Please select a script!");
      return false;
    }
    if (this.Trans.quantity == 0) {
      this.toast.show("Please enter quantity!");
      return false;
    }
    if (this.Trans.price == 0) {
      this.toast.show("Please enter price!");
      return false;
    }
    if (this.Trans.price < 0) {
      this.toast.show("Price is not valid.");
      return false;
    }
    if (this.Trans.quantity < 0) {
      this.toast.show("Quantity is not valid.");
      return false;
    }
    return valid;

  }
  async onSell(scriptid) {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 1500
    });
    await loading.present();
    if (this.Sell(scriptid)) {
      this.Trans = {
        id: 0,
        scriptid: "",
        quantity: 0,
        price: 0,
        date: Date.now(),
        tax:0,
        comission:0,
        totalcost:0,
        statusid: 0
      };
      this.ResetFields();
      await loading.onDidDismiss().then(() => {
        this.toast.show("Transaction done successfully!");
        this.resetscript=true;
      });
    } else {
      loading.dismiss();

    }
  }
  onCheck() {
    this.local.onIncludeTaxCheck(this.Tax, this.toast);
  }
  ResetFields() {
    this.selectedScriptid = undefined;
    this.textQty = null;
    this.textPrice = null;
    this.Quantity = 0;
    this.Amount = 0;
    this.Trans.quantity = 0;
    this.Trans.price = 0;
  }
  receiveTax(value:number){
    this.tax=value;
  }
  receiveComission(value:number){
    this.comission=value;
  }
  receiveCost(value:number){
    this.totalcost=value;
  }
  receiveScriptid(value:string){
    this.selectedScriptid=value;
    this.selectedScript=parseInt(value);
  }
}
