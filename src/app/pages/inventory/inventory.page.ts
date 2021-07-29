import { Component, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';
import { ViewscriptPage } from 'src/app/modal/viewscript/viewscript.page';
import { HelperService, Platforms, Tables } from 'src/app/services/helper.service';

import { LocalService } from 'src/app/services/local.service';
import { ReportService } from 'src/app/services/report.service';
import { ToastService } from 'src/app/services/toast.service';
import { LogsPage } from '../logs/logs.page';
import { PnlPage } from '../pnl/pnl.page';
import { ScriptsPage } from '../scripts/scripts.page';


@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
})
export class InventoryPage implements OnInit {

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
  public myPlatform:Platforms=null;
  public isWeb:number=0;
  public downloadJsonHref:any;
  public isGenerated=false;
  public timestamp:any= Date.now();
  constructor(public local:LocalService,public toast:ToastService,public helper:HelperService,public modalcontroller:ModalController,public report:ReportService) { 
    this.scriptList=local.scriptlist;
    this.myPlatform=helper.getPlatForm();
    if (this.myPlatform == Platforms.Web){
      this.isWeb = Platforms.Web;
      // this.report.writeJSONdesktop({report:[{A:"aaaaaaa",B:"bbbbb"}]});
        
    }
  }
  ngOnInit() {
  }
  ionViewWillEnter(){
    this.PopulateInventory();
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
      let total=bQuantity-sQuantity;
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
  async GenerateReport() {
    if (this.myPlatform == Platforms.Mobile) {
      await this.report.writeJSON("/firstfile.json", { report: [{ A: "aaaaaaa", B: "bbbbb" }] }).then(
        s => { console.log("Successfully created!") }, err => { console.log(err) });
    } else if (this.myPlatform == Platforms.Web) {
      await this.report.writeJSONdesktop(this.Scriptitem).then((s) => {
        this.isGenerated = true;
        this.downloadJsonHref=this.report.downloadJsonHref;
        console.log("generated!");
        this.timestamp=Date.now();
        this.downloadfile(this.downloadJsonHref,"Report_"+this.timestamp+".json");
      });
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
