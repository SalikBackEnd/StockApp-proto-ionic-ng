import { DatePipe } from '@angular/common';
import { Component, OnInit, SimpleChange } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { HelperService, TransactionType } from 'src/app/services/helper.service';
import { LocalService } from 'src/app/services/local.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.page.html',
  styleUrls: ['./logs.page.scss'],
})
export class LogsPage implements OnInit {
  public loglist: any = [];
  public logs = {
    script: "",
    price: 0,
    qty: 0,
    date: ""
  }
  public togglevalue: boolean = false;//false means buy and true means sell
  public scriptFilter:string;
  public fromDate:string=null;
  public toDate:string=null;
  public fdate:Date=null;
  public tdate:Date=null;
  public maxDate=new Date(Date.now()).toISOString().substr(0,10);
  public minDate="2020-01-01";
  public selectedscriptid:string=null;
  constructor(private local: LocalService, private loading:LoadingController,private toast: ToastService, private helper: HelperService, public viewCtrl: ModalController) {
    this.LogList(this.togglevalue);
  }

  ngOnInit() {
  }
  PopulateLog(list: Array<any>) {
    if (list != undefined && list.length > 0) {
      if(this.loglist.length>0){
        this.loglist=[];
      }
      list=list.reverse();
      list.forEach(buy => {
        let scriptid = buy.scriptid;
        let scriptname = this.helper.getScriptNameFromList(scriptid, this.local.scriptlist);
        let date = new Date(buy.date).toISOString().substr(0,10);
        
        this.logs = {
          script: scriptname,
          price: parseFloat((buy.price).toFixed(2)),
          qty: buy.quantity,
          date: date
        };
        this.loglist.push(this.logs);
      });
    }else{
      this.loglist=[];
    }
    console.log("List length:"+list.length)
  }
  Dismiss() {
    this.viewCtrl.dismiss({ somedata: 'Dismissed' });
  }
  async onToggle() {
    const loading=await this.loading.create({
      cssClass: 'my-custom-class',
      message: 'Loading...',
      duration: 400
    });
    await loading.present();
    loading.onDidDismiss().then(()=>{
      this.LogList(this.togglevalue,this.fdate,this.tdate,this.selectedscriptid);
    });
    
  }
  LogList(toggle:boolean,from:Date=null,to:Date=null,scriptid=null){
    let list:any=[];
      if(toggle==true)
      list=this.helper.ListSearch(TransactionType.Sell,from,to,scriptid);
      if(toggle==false)
      list=this.helper.ListSearch(TransactionType.Buy,from,to,scriptid);

      this.PopulateLog(list);
      return;
  }
  onSearch(){
    this.LogList(this.togglevalue,this.fdate,this.tdate,this.selectedscriptid);
  }
  onFromDate(){
    this.fdate=new Date(this.fromDate);  
    this.minDate=this.fdate.toISOString().substr(0,10);  
    this.LogList(this.togglevalue,this.fdate,this.tdate);
  }
  onToDate(){
    this.tdate=new Date(this.toDate);
    this.LogList(this.togglevalue,this.fdate,this.tdate);
  }
  receiveScriptid(value){
    this.selectedscriptid=value;
    this.onSearch();
  }
}
