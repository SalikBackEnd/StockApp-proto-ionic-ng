import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ViewscriptPage } from 'src/app/modal/viewscript/viewscript.page';
import { HelperService, Tables } from 'src/app/services/helper.service';

import { LocalService } from 'src/app/services/local.service';
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
  constructor(public local:LocalService,public toast:ToastService,public helper:HelperService,public modalcontroller:ModalController) { 
    this.scriptList=this.local.scriptlist;
  }

  ngOnInit() {
  }
  ionViewWillEnter(){
    this.PopulateInventory();
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
