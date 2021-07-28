
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { ScriptcomboboxComponent } from 'src/app/components/scriptcombobox/scriptcombobox.component';
import { HelperService, Tables, TransactionType } from 'src/app/services/helper.service';

import { LocalService } from 'src/app/services/local.service';
import { ToastService } from 'src/app/services/toast.service';
import { environment } from 'src/environments/environment';
import { DemocalculationPage } from '../democalculation/democalculation.page';

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
    tax:0,
    comission:0,
    totalcost:0,
    statusid: 0
  }
  textQty: string = '';
  textPrice: string = '';
  Tax: any = false;
  public logList: any = [];
  public logarr = [];
  public selectedscriptid:string="0";
  public Quantity: number = 0;
  public Amount: number = 0;
  public page = 'buy';

  public totalcost=0;
  public tax=0;
  public comission=0;

public resetscriptid:string="";
@ViewChild(ScriptcomboboxComponent) Scriptcombox:ScriptcomboboxComponent;
  constructor(public local: LocalService,public helper:HelperService, public toast: ToastService, public loadingController: LoadingController,public modalController:ModalController) {
    // this.addScriptstoSelect();
    this.local.PopulateFavScript();
  }
  
  ngOnInit() {
  }
  ionViewWillEnter(){
   
  }
  ionViewDidEnter(){
    this.helper.GetFavScripts();
    this.Scriptcombox.refreshList();
  }
  // addScriptstoSelect() {
  //   this.local.GetScripts().subscribe(res => {

  //     this.scripts = res;
  //   }, err => {
  //     console.log(err)
  //   });
  //   console.log("Buy page")
  //   console.log(this.scripts)
  // }

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
        tax:0,
        comission:0,
        totalcost:0,
        statusid: 0
      }
      this.ResetFields();
      loading.onDidDismiss().then(() => {
        this.toast.show("Transaction done successfully!");
        this.resetscriptid=null;
      });

    }
    else {
      loading.dismiss();
      
    }
  }

  SetBuyData() {
    let key = Tables.Transaction;
    if (this.isBuyValid()) {
      this.logList = this.local.GetData(key);
      if (this.logList != undefined) {

        this.Trans.id = this.local.GenerateId(key);
        this.Trans.scriptid=this.selectedscriptid;
        this.Trans.statusid = TransactionType.Buy;
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
        this.logList.push(this.Trans);
        this.local.SetData(key, this.logList);
        return true;
      } else {
        this.Trans.id = this.local.GenerateId(key);
        this.Trans.scriptid=this.selectedscriptid;
        this.Trans.statusid = TransactionType.Buy;
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
    if (this.selectedscriptid == "" || this.selectedscriptid=="0") {
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
    this.selectedscriptid=value;
  }
  async OpenDemoBuy(){
    const modal=await this.modalController.create({component:DemocalculationPage});
    return await modal.present();
  }
}
