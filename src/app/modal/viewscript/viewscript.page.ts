import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { HelperService } from 'src/app/services/helper.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-viewscript',
  templateUrl: './viewscript.page.html',
  styleUrls: ['./viewscript.page.scss'],
})
export class ViewscriptPage implements OnInit {

 scriptName:string;
 scriptid:string;
  qty:number=0;
  rate:number=0;
  buyed:number=0;
  sold:number=0;
  bonus:number=0;
  totalCost:number=0;
  textCPrice:number=null;

  PLState:number=0;
  PLAmount:number=0;


  constructor(
    public navParam:NavParams,
    public viewCtrl:ModalController,
    public helper:HelperService,
    public toast:ToastService
    ) { 
    this.scriptName=navParam.get('scriptName');
    this.scriptid=navParam.get('scriptid')
  }

  ngOnInit() {
  }
  Dismiss(){
    this.viewCtrl.dismiss({somedata:'Dismissed'});
  }
  ionViewWillEnter(){
    let id=parseInt(this.scriptid);
    this.bonus=this.helper.PayoutQuantitybyScript(id);
    this.qty=this.helper.scriptTotalQuantity(id);
    this.rate=this.helper.AverageScriptCost(id);
    this.buyed=this.helper.scriptsBuyQuantity(id);
    this.sold=this.helper.scriptsSellQuantity(id);
    this.totalCost=this.helper.TotalCostbyScript(id);
  }
  onCPriceEnter() {
    if (this.textCPrice > 0) {
      let price = this.textCPrice;
      let PLobj = this.helper.getProfitnLoss(this.scriptid, this.rate, price);
      this.PLState = PLobj.pnlstate;
      this.PLAmount = PLobj.amount;
    }
  }
  onInputCPrice(value) {
    var reg = /^[1-9]\d*(\.\d+)?$/;
    if (!reg.test(value)) {
      this.textCPrice = null;
      this.PLState = 0;
      this.PLAmount = 0;
      if (value != "" || value != "0")
        this.toast.show("Enter valid price!");
    }
  }
}
