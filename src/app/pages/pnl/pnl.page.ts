import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { HelperService, PnL, Tables } from 'src/app/services/helper.service';
import { LocalService } from 'src/app/services/local.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-pnl',
  templateUrl: './pnl.page.html',
  styleUrls: ['./pnl.page.scss'],
})
export class PnlPage implements OnInit {


  public Scripts:any=[];
  public List:any=[];
  public PnL={
    date:"",
    Transactions:[]
  }
  public transaction={
    scriptsname:"",
    PnL:0,
    buyprice:0,
    sellprice:0,
    state:0
  }
  constructor(public local:LocalService,public helper:HelperService,public toast: ToastService,public loadingController:LoadingController,public viewCtrl:ModalController) { 

    this.Populate();
  }

  ngOnInit() {
  }

  Populate(){
    this.Scripts=this.local.scriptlist;
    let dates=this.helper.SoldDates();
    if(dates.length>0){
      dates.forEach(e => {
        let t=this.helper.getTransactionbyDate(e,this.local.SellList());
        if(t.length>0){
          t.forEach(ele => {
            
            let buyprice=this.helper.getBuyAvgPrice(ele.scriptid,ele.date);
            let pnlobj=this.helper.getProfitnLoss(ele.scriptid,buyprice,ele.price,ele.date);
            let scriptname=this.helper.getScriptNameFromList(ele.scriptid,this.Scripts);
            this.transaction={
              scriptsname:scriptname,
              PnL:pnlobj.amount,
              buyprice:buyprice,
              sellprice:ele.price,
              state:pnlobj.pnlstate
            };
            this.PnL.Transactions.push(this.transaction);
          });
        }
        this.PnL.date=new Date(e).toDateString();
        this.List.push(this.PnL);
      });
      
    }
  }
  Dismiss(){
    this.viewCtrl.dismiss({somedata:'Dismissed'});
  }
}
