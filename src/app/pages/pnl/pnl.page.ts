import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { DemoplPage } from 'src/app/modal/demopl/demopl.page';
import { HelperService, Payout, PnL, Tables } from 'src/app/services/helper.service';
import { LocalService } from 'src/app/services/local.service';
import { ToastService } from 'src/app/services/toast.service';
import { PayoutPageModule } from '../payout/payout.module';

@Component({
  selector: 'app-pnl',
  templateUrl: './pnl.page.html',
  styleUrls: ['./pnl.page.scss'],
})
export class PnlPage implements OnInit {


  public Scripts: any = [];
  public List: any = [];
  public PnL = {
    date: "",
    Transactions: [],
    Payouts:[]
  }
  public transaction = {
    scriptsname: "",
    PnL: 0,
    buyprice: 0,
    sellprice: 0,
    state: 0
  }
  public payout={
    scriptsname: "",
    type:0,
    tax:0,
    percent:0,
    amount:0,
    typename:""
  };
  public selectedScript = "";
  public resetscriptid: string = "";
  public isShowingAll = true;
  public toDate:string=null;
  public fromDate:string=null;
  public maxDate=new Date(Date.now()).toISOString().substr(0,10);
  public minDate="2020-01-01";
  public fdate:Date=null;
  public tdate:Date=null;
  constructor(public local: LocalService, public helper: HelperService, public toast: ToastService, public loadingController: LoadingController, public viewCtrl: ModalController) {

    this.Populate();
  }

  ngOnInit() {
  }

  Populate() {
    this.Scripts = this.local.scriptlist;
    let dates = this.helper.SoldDates();
    let payoutdate=this.helper.PayoutDates();
    if(payoutdate.length>0){
      dates.concat(payoutdate);
      dates=dates.filter(this.helper.onlyUnique);
    }
    if (dates.length > 0) {
      dates = dates.reverse();
      dates.forEach(e => {
        this.PnL = {
          date: "",
          Transactions: [],
          Payouts:[]
        }

        let t = this.helper.getTransactionbyDate(e, this.local.SellList());
        let payouts=this.helper.getPayoutsbyDate(e,this.helper.PayoutList());
        if (t.length > 0) {
          t.forEach(ele => {
            // let buyprice=this.helper.getBuyAvgPrice(ele.scriptid,ele.date);
            let buyprice = this.helper.AverageCostbyTotalCost(ele.scriptid, ele.date);
            let scriptname = this.helper.getScriptNameFromList(ele.scriptid, this.Scripts);
            let sellprice = this.helper.ActualSellCostbyTotalCost(ele.quantity, ele.totalcost);
            let pnlobj = this.helper.getProfitnLoss(ele.scriptid, buyprice, sellprice, ele.date);

            this.transaction = {
              scriptsname: scriptname,
              PnL: parseFloat(pnlobj.amount.toFixed(2)),
              buyprice: buyprice,
              sellprice: sellprice,
              state: pnlobj.pnlstate
            };
            this.PnL.Transactions.push(this.transaction);
          });
          this.PnL.Transactions = this.PnL.Transactions.reverse();
        }
        if(payouts.length>0){
          payouts.forEach(ele => {
            let scriptname = this.helper.getScriptNameFromList(ele.scriptid, this.Scripts);
            let type= ele.type;
            let typename="";
            if(type==Payout.Dividend) typename="Dividend";
            if(type==Payout.Bonus) typename="Bonus";
              this.payout={
              scriptsname: scriptname,
              amount: ele.Amount,
              percent: ele.percent,
              tax: ele.tax,
              typename: typename,
              type:ele.type
            };
            this.PnL.Payouts.push(this.payout);
          });
          this.PnL.Payouts=this.PnL.Payouts.reverse();
        }
        this.PnL.date = new Date(e).toDateString();
        this.List.push(this.PnL);
        this.isShowingAll = true;
      });
    }
  }
  PopulateWithParameter(Scriptid, fromDate: Date = null, toDate: Date = null) {
    this.Scripts = this.local.scriptlist;
    this.List = [];
    let dates = this.helper.SoldDatesByScript(Scriptid,fromDate,toDate);
    let payoutdate=this.helper.PayoutDates();
    if(payoutdate.length>0){
      dates.concat(payoutdate);
      dates=dates.filter(this.helper.onlyUnique);
    }
    if (dates.length > 0) {
      dates = dates.reverse();
      dates.forEach(e => {
        this.PnL = {
          date: "",
          Transactions: [],
          Payouts:[]
        }

        let t = this.helper.getTransactionbyDate(e, this.local.scriptsSellList(Scriptid));
        let payouts=this.helper.getPayoutsbyDate(e,this.helper.PayoutList());
        if (t.length > 0) {
          t.forEach(ele => {
            // let buyprice=this.helper.getBuyAvgPrice(ele.scriptid,ele.date);
            let buyprice = this.helper.AverageCostbyTotalCost(ele.scriptid, ele.date);
            let scriptname = this.helper.getScriptNameFromList(ele.scriptid, this.Scripts);
            let sellprice = this.helper.ActualSellCostbyTotalCost(ele.quantity, ele.totalcost);
            let pnlobj = this.helper.getProfitnLoss(ele.scriptid, buyprice, sellprice, ele.date);

            this.transaction = {
              scriptsname: scriptname,
              PnL: parseFloat(pnlobj.amount.toFixed(2)),
              buyprice: buyprice,
              sellprice: sellprice,
              state: pnlobj.pnlstate
            };
            this.PnL.Transactions.push(this.transaction);
          });
          this.PnL.Transactions = this.PnL.Transactions.reverse();
        } if(payouts.length>0){
          payouts.forEach(ele => {
            let scriptname = this.helper.getScriptNameFromList(ele.scriptid, this.Scripts);
            let type= ele.type;
            let typename="";
            if(type==Payout.Dividend) typename="Dividend";
            if(type==Payout.Bonus) typename="Bonus";
              this.payout={
              scriptsname: scriptname,
              amount: ele.Amount,
              percent: ele.percent,
              tax: ele.tax,
              typename: typename,
              type:ele.type
            };
            this.PnL.Payouts.push(this.payout);
          });
          this.PnL.Payouts=this.PnL.Payouts.reverse();
        }
        this.PnL.date = new Date(e).toDateString();
        this.List.push(this.PnL);
        this.isShowingAll = false;
      });
    } else {
      this.List = [];
    }
  }
  Dismiss() {
    this.viewCtrl.dismiss({ somedata: 'Dismissed' });
  }
  receiveScriptid(value) {
    this.selectedScript = value;
    if (this.selectedScript != "")
    this.PopulateWithParameter(this.selectedScript,this.fdate,this.tdate);
  }
  showAll() {
    if (this.isShowingAll == false) {
      this.List = [];
      this.Populate();
      this.resetscriptid = null;
      this.fromDate=null;
      this.toDate=null;
      this.fdate=null;
      this.tdate=null;
    }
  }
  onFromDate(){
    
    this.fdate=new Date(this.fromDate);  
    this.minDate=this.fdate.toISOString().substr(0,10);
    let idate=this.minDate;
    if (this.toDate != null) {
      let ndate = this.tdate.toISOString().substr(0, 10);
      if (ndate != null) {
        if (idate > ndate) {
          this.toDate = null;
          this.tdate = null;
        }
      }
    }
    this.PopulateWithParameter(this.selectedScript,this.fdate,this.tdate);
    //this.LogList(this.togglevalue,this.fdate,this.tdate);
  }
  onToDate(){
    if(this.toDate != null && this.toDate != "")
    this.tdate=new Date(this.toDate);
    else
    this.tdate=null;

    this.PopulateWithParameter(this.selectedScript,this.fdate,this.tdate);
    //this.LogList(this.togglevalue,this.fdate,this.tdate);
  }
  async OpenDemoPL(){
    const modal=await this.viewCtrl.create({component:DemoplPage});
    return await modal.present();
  }
}
