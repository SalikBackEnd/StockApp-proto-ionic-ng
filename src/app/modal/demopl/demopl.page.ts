import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HelperService } from 'src/app/services/helper.service';
import { LocalService } from 'src/app/services/local.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-demopl',
  templateUrl: './demopl.page.html',
  styleUrls: ['./demopl.page.scss'],
})
export class DemoplPage implements OnInit {

  public totalqty:number=0;
  public avgrate:number=0;
  
  public newqty:number=0;
  public newAvgrate:number=0;

  public PLState:number=0;
  public PLAmount:number=0;

  public textqty:number=null;
  public textprice:number=null;
  

  public selectedScript = "";
  public resetscript=false;

  constructor(
    public local:LocalService,
    public helper:HelperService,
    public viewCtrl:ModalController,
    public toast:ToastService
  ) {

   }

  ngOnInit() {
  }
 async Dismiss(){
    await this.viewCtrl.dismiss();
  }
  receiveScriptid(id){
    this.selectedScript=id;
    this.avgrate=this.getAvgRatebyScript(id);
    this.totalqty=this.getTotalQty(id);
    if (this.textprice > 0 && this.textqty>0 && this.avgrate>0 && this.totalqty>0 && this.textqty<=this.totalqty) {
      this.CalculateUnrealisedPL(this.avgrate,this.textprice,this.textqty);
    }else{
      this.PLState=0;
      this.showMsg();
    }
  }
  getTotalQty(id){
    return this.helper.scriptTotalQuantity(id);
  }
  getAvgRatebyScript(id){
    return this.helper.AverageCostbyTotalCost(id);
  }
  onPriceInput(value){
    let price=parseFloat(value.toFixed(2));
    if(isNaN(price) || isNaN(value) || price<0){
      this.textprice=0;
    }
  }
  onQuantityInput(value){
    let qty=parseInt(value);
    if(isNaN(qty) || isNaN(value) ||qty<0){
      this.textqty=0;
    }
  }
  onPriceChange() {
    if (this.textprice > 0 && this.textqty>0 && this.avgrate>0 && this.totalqty>0 && this.textqty<=this.totalqty) {
      this.CalculateUnrealisedPL(this.avgrate,this.textprice,this.textqty);
    }else{
      this.PLState=0;
      this.showMsg();
    }
  }
  onqtyChange(){
    if(this.textqty>0 && this.textprice>0 && this.avgrate>0 && this.totalqty>0 && this.textqty<=this.totalqty){
      this.CalculateUnrealisedPL(this.avgrate,this.textprice,this.textqty);
    }else{
      this.PLState=0;
      this.showMsg();
    }
  }
  CalculateUnrealisedPL(avgrate,currentprice,currentquantity){
    let PLobj = this.helper.getUnrealisedPL(avgrate, currentprice,currentquantity);
      this.PLState = PLobj.pnlstate;
      this.PLAmount = PLobj.amount;
      this.newqty=currentprice-this.totalqty;
  }

  showMsg(){
    let msg="";
    let duration=600;
    if(this.totalqty==0){
      msg="Please select a script that have enough quantity.";
    }else if(this.textqty<0 ||this.textqty==null){
      msg="Please enter a valid quantity.";
    }else if(this.textqty>this.totalqty){
      msg="Sell quantity can not be greater then current quantity."
      duration=1000;
    }
    else if(this.textprice<0 || this.textprice==null){
      msg="Please enter a valid price.";
    }
    else{
      msg="Something Went wrong.";
    }
    this.toast.show(msg,duration)
  }
}
