import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';

import { HelperService, Tables } from 'src/app/services/helper.service';
import { LocalService } from 'src/app/services/local.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-scripts',
  templateUrl: './scripts.page.html',
  styleUrls: ['./scripts.page.scss'],
})
export class ScriptsPage implements OnInit {

  public scripts:any=[];
  public objfavscripts:any={
    id:"",name:"",fav:false
    };
  constructor(public local:LocalService,public helper:HelperService,public toast:ToastService,public loadingController:LoadingController,public viewCtrl:ModalController) 
  {
    this.local.PopulateFavScript();
    this.GetFavScripts();

  }
  ngOnInit() {
  }
  GetFavScripts(){
    let favScripts:any=[];
    favScripts= this.local.GetData(Tables.FavScripts);
    if(favScripts!=undefined && favScripts.length>0){
      this.scripts=favScripts;
    }else{
      this.scripts= [];
    }
  }
 SetFavScripts(){
   
 }
 
  Dismiss(){
    this.viewCtrl.dismiss({somedata:'Dismissed'});
  }
}
