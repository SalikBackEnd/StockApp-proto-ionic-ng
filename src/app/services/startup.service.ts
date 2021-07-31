import { Injectable } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Platform } from '@ionic/angular';
import { Platforms } from './helper.service';

@Injectable({
  providedIn: 'root'
})
export class StartupService {

  public myPlatform:Platforms=null;

  constructor(public permission:AndroidPermissions,private platform:Platform) { 
    console.log("Startup Service started..")
    this.myPlatform=this.getPlatForm();
    if(this.myPlatform==Platforms.Mobile){
      this.StoragePermission();
    }
   
  }
  StoragePermission(){
    
    this.permission.checkPermission(this.permission.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
      res=>console.log("Has Storage Permission? "+res.hasPermission),
      err => this.permission.requestPermission(this.permission.PERMISSION.WRITE_EXTERNAL_STORAGE)
    );
    this.permission.requestPermissions([this.permission.PERMISSION.WRITE_EXTERNAL_STORAGE, this.permission.PERMISSION.GET_ACCOUNTS]);
  }
  getPlatForm(){
    let p:any=[];
    p=this.platform.platforms();
    if(p.includes("desktop")){
      return Platforms.Web;
    }else if(p.includes("hybrid") || p.includes("capacitor")){
      return Platforms.Mobile;
    }else if(p.includes("mobileweb")){
      return Platforms.Web;
    }
    
  }
}
