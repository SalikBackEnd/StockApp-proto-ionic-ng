import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInput, LoadingController, ModalController } from '@ionic/angular';
import { HelperService, Payout, Tables } from 'src/app/services/helper.service';
import { LocalService } from 'src/app/services/local.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-payout',
  templateUrl: './payout.page.html',
  styleUrls: ['./payout.page.scss'],
})
export class PayoutPage implements OnInit {

  private Payout={
    id:0,
    scriptid:"",
    type:0,
    taxpercent:0,
    percent:0,
    taxamount:0,
    Amount:0,
    date:Date.now()
  }

  public selectedscriptid:string=null;

  public dividendChecked:boolean=true;
  public bonusChecked:boolean=false;
  public isFiler:boolean=true;

  public textDividend:number=null;
  public textBonus:number=null;;
  public dividendAmount:number=0;
  public totaldividend:number=0;
  public bonusqty:number=0;
  public tax:number=0;
  public taxamount:number=0;

  constructor(
    private local: LocalService,
    private loading: LoadingController,
    private toast: ToastService,
    private helper: HelperService,
    public viewCtrl: ModalController
  ) { 

  }
  @ViewChild('DividendField') dividendField:IonInput;
  @ViewChild('BonusField') bonusField:IonInput;
  ionViewDidEnter(){
    this.onFilerCheck();
  }
  ngOnInit() {
  }
  receiveScriptid(value){
    this.selectedscriptid=value;
  }
  Dismiss(){
    this.viewCtrl.dismiss();
  }
  

  DividendAmount(sharecount,dividend){
    return (dividend)*(sharecount);
  }
  DividendTax(dividentAmount,taxpercentage){
    return dividentAmount*(taxpercentage/100);
  }
  BonusQty(currentshares:number,bounspercentage:number){
    return (bounspercentage)*(currentshares/100);
  }
  getSharesbyScript(id){
    return this.helper.scriptTotalQuantity(id)
  }
  getAmountbyScript(id){
    return this.helper.TotalCostbyScript(id);
  }

  onFilerCheck(){
    if(this.isFiler){
      this.tax=15;
    }else{
      this.tax=30;
    }
    this.onFilerChange();
  }
  onDividendEnter() {
   // percentage = parseInt(percentage);
    if (this.Validation(this.textDividend)) {
      let currentamount = this.getSharesbyScript(this.selectedscriptid);
      this.totaldividend = this.DividendAmount(currentamount, this.textDividend);
      this.taxamount = this.DividendTax(this.totaldividend, this.tax);
      this.dividendAmount = parseFloat((this.totaldividend - this.taxamount).toFixed(3));
    }else{
      this.textDividend=0;
    }
  }
  onBonusEnter() {
   // percentage = parseInt(percentage);
    if (this.Validation(this.textBonus)) {
      let currentShare = this.getSharesbyScript(this.selectedscriptid);
      this.bonusqty = this.BonusQty(currentShare, this.textBonus);
    }else{
      this.textBonus=0;
    }
  }

  onInputDividend(value) {
    if (this.selectedscriptid != undefined || this.selectedscriptid != null) {
      var reg = /^[0-9]\d*$/;
      if (!reg.test(value)) {
        this.textDividend = null;
        this.dividendField.value = '';
      }
    }else{
      this.textDividend=null;
      this.toast.show("Select a script!");
    }
  }
  onInputBonus(value) {
    if (this.selectedscriptid != undefined || this.selectedscriptid != null) {
      var reg = /^[0-9]\d*$/;
      if (!reg.test(value)) {
        this.textBonus = null;
        this.bonusField.value = '';
      }
    }else{
      this.textBonus=null;
      this.toast.show("Select a script!");
    }
  }
  onFilerChange(){
    this.onDividendEnter();
    this.onBonusEnter();
  }
  Validation(value){
   if(value<0){
      this.toast.show("Enter valid values!");
      return false
    }else{
      return true;
    }
  }
  pay(){
      let list= this.populate();
      if(list.length>0){
      this.local.SetData(Tables.Payout,list);
      this.toast.show("Successfully payout!",500);
      this.viewCtrl.dismiss({data:"refresh"});
    }else{
      this.toast.show("Enter dividend or bonus!")
    }
      
  }
  populate() {
    let list: any = [];
    list = this.local.GetData(Tables.Payout);
    let newid = 0;
    let dividen = false;
    let bonus = false;
    if (this.dividendChecked && this.dividendAmount > 0 && this.textDividend > 0) {
      newid = this.local.GenerateId(Tables.Payout);
      this.Payout = {
        id: newid,
        scriptid: this.selectedscriptid,
        type: Payout.Dividend,
        taxpercent: this.tax,
        taxamount: this.taxamount,
        percent: this.textDividend,
        Amount: this.dividendAmount,
        date: Date.now()
      }
      list.push(this.Payout);
      dividen = true;
    }
    if (this.bonusChecked && this.bonusqty > 0 && this.textBonus > 0) {
      let id = this.local.GenerateId(Tables.Payout);
      if (newid == id) {
        id = id + 1;
      }
      this.Payout = {
        id: id,
        scriptid: this.selectedscriptid,
        type: Payout.Bonus,
        taxpercent: this.tax,
        taxamount: this.taxamount,
        percent: this.textBonus,
        Amount: this.bonusqty,
        date: Date.now()
      }
      list.push(this.Payout);
      bonus = true;
    }

    if (dividen || bonus) {
      return list;
    } else {
      return [];
    }

  }
}