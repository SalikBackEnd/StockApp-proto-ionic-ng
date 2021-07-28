import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { DataTypes, HelperService, Tables } from 'src/app/services/helper.service';
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
  
  
  constructor(public local:LocalService,public helper:HelperService,public toast:ToastService,public viewCtrl:ModalController) 
  {
    
    this.GetFavScripts();

  }
  ngOnInit() {
  }
  GetFavScripts(){
    let favScripts:any=[];
    favScripts= this.local.GetData(Tables.FavScripts);
    if(favScripts!=undefined && favScripts.length>0){
      this.scripts=this.helper.SortHelper(favScripts,DataTypes.Boolean); //return a sorted list of array with true values first
    }else{
      this.scripts= [];
    }
  }
  // addFavScripts(id,fav=true){
  //   this.ionitemSliding.closeOpened().then(()=>{
  //     let favScripts:any=[];
  //   this.scripts.find(x=>x.id==id).fav=!fav;
  //   console.log(this.scripts);
  //   this.local.SetData(Tables.FavScripts,this.scripts);
  //   this.scripts=this.helper.SortHelper(this.scripts,DataTypes.Boolean);
  //   });
    addFavScripts(id,fav=true){
     
    this.scripts.find(x=>x.id==id).fav=!fav;
    console.log(this.scripts);
    this.local.SetData(Tables.FavScripts,this.scripts);
    this.scripts=this.helper.SortHelper(this.scripts,DataTypes.Boolean);
    
  }
  
  Dismiss(){
    this.viewCtrl.dismiss({somedata:'Dismissed'});
  }
  // loadData(event) {
  //   setTimeout(() => {
  //     console.log('Done');
  //     event.target.complete();

  //     // App logic to determine if all data is loaded
  //     // and disable the infinite scroll
  //     if (this.scripts.length == 1000) {
  //       event.target.disabled = true;
  //     }
  //   }, 500);
  // }
}
