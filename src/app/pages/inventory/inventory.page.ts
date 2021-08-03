import { Component, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';
import { ViewscriptPage } from 'src/app/modal/viewscript/viewscript.page';
import { HelperService, Platforms, Tables } from 'src/app/services/helper.service';
import { LoaderService } from 'src/app/services/loader.service';

import { LocalService } from 'src/app/services/local.service';
import { ReportService } from 'src/app/services/report.service';
import { ToastService } from 'src/app/services/toast.service';
import { LogsPage } from '../logs/logs.page';
import { PayoutPage } from '../payout/payout.page';
import { PnlPage } from '../pnl/pnl.page';
import { ScriptsPage } from '../scripts/scripts.page';


@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
})
export class InventoryPage implements OnInit {

  public reportObject={
    Inventory:[],
    ProfitLoss:[],
    Transactions:[]
  } 

  public List={
    scripts:[],
    shareCount:[],
    shareAverage:[]
  };
  public Inventory={
    script:{},
    count:0,
    avgRate:0
  };
  public buyList:any=[];
  public sellList:any=[];
  public scriptList:any=[];
  public Scriptitem:any=[];

  public limit=3;
  public index=0;
  public isWeb:number=0;

  public myPlatform:Platforms=null;
  
  public isGenerated=false;

  public downloadJsonHref:any;
  public timestamp:any= Date.now();

  public isDownloadAvailable=false;

  constructor(public local:LocalService,public toast:ToastService,private loader:LoaderService,public helper:HelperService,public modalcontroller:ModalController,public report:ReportService) { 
    this.scriptList=local.scriptlist;
    this.myPlatform=helper.getPlatForm();
    if (this.myPlatform == Platforms.Web){
      this.isWeb = Platforms.Web;
    }
  }
  ngOnInit() {
  }
  ionViewWillEnter(){
    this.PopulateInventory();
    this.checkIsDownloadAvailable();
    this.isGenerated=false;
  }
  PopulateInventory(){
    this.List={
      scripts:[],
      shareCount:[],
      shareAverage:[]
    };
    let scripts=this.scriptList;
    scripts.forEach(el => {
    
        let bQuantity=this.helper.scriptsBuyQuantity(el.id);
      let sQuantity=this.helper.scriptsSellQuantity(el.id);
      let bonusQty=this.helper.PayoutQuantitybyScript(el.id);
      let total=(bQuantity+bonusQty)-sQuantity;
      let avgcost=0;
      if(total != 0){
        //avgcost=this.helper.AverageScriptCost(el.id);
        avgcost=this.helper.AverageCostbyTotalCost(el.id);
        this.Inventory = {
          script: { id: el.id, name: el.name },
          count: total,
          avgRate: avgcost
        };
        this.List.scripts.push(this.Inventory);
      }
    });
   
     this.Scriptitem=this.List.scripts;
     
  }
 
  GetScriptsList(){
    let s:any=[];
      this.local.GetScripts().subscribe(res=>{
       s=res;
       },err=>{
         console.log(err)
       }); 
     return s;
   }
   ResetStorage(){
     localStorage.clear();
     this.ionViewWillEnter();
   }

   async OpenScriptDetails(scriptid,scriptName){
     const modal=await this.modalcontroller.create({component:ViewscriptPage,componentProps:{scriptid:scriptid,scriptName:scriptName}});
     modal.onDidDismiss().then(data=>{
       console.log(data);
      });
     return await modal.present();
   }
   async OpenPnL(){
    const modal=await this.modalcontroller.create({component:PnlPage});
    return await modal.present();
   }
   async OpenLogs(){
    const modal=await this.modalcontroller.create({component:LogsPage});
    return await modal.present();
   }
   async OpenScripts(){
    const modal=await this.modalcontroller.create({component:ScriptsPage});
    return await modal.present();
   }
   async OpenPayout(){
    const modal=await this.modalcontroller.create({component:PayoutPage});
    modal.onDidDismiss().then(data=>{
      this.ionViewWillEnter();
     });
    return await modal.present();
   }
  async GenerateReport() {
    
    this.reportObject={
      Inventory:this.Scriptitem,
      ProfitLoss:this.report.PopulateProfitnLoss(),
      Transactions:[{Buy:this.local.BuyList(),Sell:this.local.SellList()}]
    };
    let loader=this.loader.show("Generating Report...");
    if (this.isDownloadAvailable = true) {
      if (this.myPlatform == Platforms.Mobile) {
        await this.report.writeJSON("Report_" + this.timestamp + ".json", this.reportObject).then(
          async res=>{
            console.log(res);
            //this.toast.show("Report generated in local storage under 'StockfolioReports' directory.");
            await this.loader.dismiss(loader).then(res=>{
              this.toast.show("Report generated in local storage under 'StockfolioReports' directory.");
            });
          },
          err=>{
            console.log(err);
            this.toast.show("Error occur while generating report!")  
          }
          );
      }
      else if (this.myPlatform == Platforms.Web) {
        await this.report.writeJSONdesktop(this.reportObject).then((s) => {
          this.isGenerated = true;
          this.downloadJsonHref = this.report.downloadJsonHref;
          console.log("generated!");
          this.timestamp = Date.now();
          this.downloadfile(this.downloadJsonHref, "Report_" + this.timestamp + ".json");
        }, err => console.log(err)
        );
      }
    }else{
      this.toast.show("No data to generate report.")
    }
  }
  downloadfile(Urlobj:object,filename){
    var a = document.createElement('A');
    a.setAttribute("href",Object.values(Urlobj)[0]);
    a.setAttribute("download",filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  checkIsDownloadAvailable(Inventory:any=[],ProfitLoss:any=[],Transactions:any=[]){
    if(Inventory.length<=0){
     this.isDownloadAvailable=false;
    }
    this.isDownloadAvailable=true;
  }
  //  doInfinite(event){
  //   console.log('Begin async operation');
  //     setTimeout(()=>{
  //       let tenitems= this.List.scripts;
  //       console.log("Ten Item List");
  //       console.log(tenitems);
  //       for(let i=0;i<tenitems.length;i++){
  //         this.Scriptitem.push(tenitems[i]);
  //       }
  //       event.target.complete();
  //          this.index+=3;
  //          this.limit+=3;
           
  //         console.log('Async operation has ended'+"\n Index at "+this.index+"\n Limit at "+this.limit);
  //     },1000);
  // }
}
