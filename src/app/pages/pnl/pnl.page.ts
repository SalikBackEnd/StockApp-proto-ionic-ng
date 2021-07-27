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


  public Scripts: any = [];
  public List: any = [];
  public PnL = {
    date: "",
    Transactions: []
  }
  public transaction = {
    scriptsname: "",
    PnL: 0,
    buyprice: 0,
    sellprice: 0,
    state: 0
  }
  public selectedScript = "";
  public resetscriptid: string = "";
  public isShowingAll = true;
  constructor(public local: LocalService, public helper: HelperService, public toast: ToastService, public loadingController: LoadingController, public viewCtrl: ModalController) {

    this.Populate();
  }

  ngOnInit() {
  }

  Populate() {
    this.Scripts = this.local.scriptlist;
    let dates = this.helper.SoldDates();
    if (dates.length > 0) {
      dates = dates.reverse();
      dates.forEach(e => {
        this.PnL = {
          date: "",
          Transactions: []
        }

        let t = this.helper.getTransactionbyDate(e, this.local.SellList());
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
        this.PnL.date = new Date(e).toDateString();
        this.List.push(this.PnL);
        this.isShowingAll = true;
      });
    }
  }
  PopulateWithParameter(Scriptid, fromDate: Date = null, toDate: Date = null) {
    this.Scripts = this.local.scriptlist;
    this.List = [];
    let dates = this.helper.SoldDatesByScript(Scriptid);
    if (dates.length > 0) {
      dates = dates.reverse();
      dates.forEach(e => {
        this.PnL = {
          date: "",
          Transactions: []
        }

        let t = this.helper.getTransactionbyDate(e, this.local.scriptsSellList(Scriptid));
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
      this.PopulateWithParameter(this.selectedScript);
  }
  showAll() {
    if (this.isShowingAll == false) {
      this.List = [];
      this.Populate();
      this.resetscriptid = null;
    }
  }
}
