import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInput, LoadingController, ModalController } from '@ionic/angular';
import { HelperService } from 'src/app/services/helper.service';
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
    tax:0,
    dividend:0,
    bonus:0,
    date:Date.now()
  }

  public selectedscriptid:string=null;

  public dividendChecked:boolean=true;
  public bonusChecked:boolean=false;
  public isFiler:boolean=true;

  public textDividend:number=null;
  public textBonus:number=null;;
  public dividendAmount:number=0;
  public bonusqty:number=0;
  public tax:number=0;

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
  

  DividendAmount(CurrentAmount,dividendpercentage){
    
    return (dividendpercentage/100)*(CurrentAmount/10);
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
  }

  onDividendEnter() {
   // percentage = parseInt(percentage);
    if (this.Validation(this.textDividend)) {
      let currentamount = this.getAmountbyScript(this.selectedscriptid);
      this.dividendAmount = this.DividendAmount(currentamount, this.textDividend);
      let taxamount = this.DividendTax(this.dividendAmount, this.tax);
      this.dividendAmount = this.dividendAmount - taxamount;
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

  onInput(value){
    var reg = /^[0-9]\d*$/;
    if(!reg.test(value)){
      this.textDividend=null;
      this.dividendField.value='';
    }
  }

  Validation(value){
   if(value<0){
      this.toast.show("Enter valid values!");
      return false
    }else{
      return true;
    }
  }
}