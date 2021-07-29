import { Injectable } from '@angular/core';

import { File } from '@ionic-native/file/ngx';
import { Platform } from '@ionic/angular';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { DomSanitizer } from '@angular/platform-browser';


@Injectable({
  providedIn: 'root'
})
export class ReportService {
  public currentPlatform:any=[];
  public downloadJsonHref:any;
  constructor(private File:File,private platform:Platform,private fileChooser:FileChooser,private sanitizer:DomSanitizer) { 
    this.currentPlatform=platform.platforms();
  } 
  async isCreated(rootdirectory,directoryname){
  let exist= this.File.checkDir(rootdirectory,directoryname);
  if(!exist){
    await this.File.createDir(rootdirectory,directoryname,true).then(s=>{
      console.log("Directory Created! at "+rootdirectory);
      return true;
    });
  }else{
    return true;
  }
  }
  async writeJSON(filename,object){
   console.log(this.platform.platforms());
   if(this.currentPlatform.includes('hybrid'))
    await this.writeJSONAndroid(filename,object);
  //  }else if(this.currentPlatform.includes('desktop') || this.currentPlatform.includes('mobileweb')){
  //   await this.writeJSONdesktop(object).;
  //  }
  }
  async writeJSONAndroid(filename,object){
    let datadirectory=this.File.dataDirectory;
    let directoryname="Stockfolio_Reports";
    let extrootdirectory=this.File.externalRootDirectory;
    let condition=await this.isCreated(datadirectory,directoryname);
    if (condition) {
      await this.File.createFile(datadirectory+directoryname, filename, true).then(
        (v) => {
          this.File.writeFile(v.fullPath, filename, object).then((s)=> {
            // let f= this.isCreated(extrootdirectory,directoryname);
            // if(f)
            //  this.File.moveFile(v.fullPath,filename,extrootdirectory,directoryname);
            console.log("file written!")
          }, err => { console.log(err) });
        },
        err => { console.log(err) });
    }
  }
   writeJSONdesktop(object){
    return new Promise<void>((resolve,reject)=>{
      var theJSON = JSON.stringify(object);
      var uri = this.sanitizer.bypassSecurityTrustUrl("data:text/json;charset=UTF-8," + encodeURIComponent(theJSON));
      this.downloadJsonHref = uri;
      if(this.downloadJsonHref!=(undefined&&null) ){
        resolve();
      }
    });
    
  }
}
