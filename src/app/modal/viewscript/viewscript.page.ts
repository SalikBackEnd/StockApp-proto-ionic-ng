import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-viewscript',
  templateUrl: './viewscript.page.html',
  styleUrls: ['./viewscript.page.scss'],
})
export class ViewscriptPage implements OnInit {

 scriptName:string;
 scriptid:string;
  qty=0;
  rate=0;
  buyed=0;
  sold=0;
  bonus=0;
  totalCost=0;
  constructor(public navParam:NavParams,public viewCtrl:ModalController,public helper:HelperService) { 
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
    this.qty=this.helper.scriptTotalQuantity(id);
    this.rate=this.helper.AverageScriptCost(id);
    this.buyed=this.helper.scriptsBuyQuantity(id);
    this.bonus=this.helper.PayoutQuantitybyScript(id);
    this.sold=this.helper.scriptsSellQuantity(id);
    this.totalCost=this.helper.TotalCostbyScript(id);
  }
}
