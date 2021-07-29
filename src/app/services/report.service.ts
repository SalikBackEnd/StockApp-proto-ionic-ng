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
    let created=true;
    console.log("In isCreated!")
  await this.File.checkDir(rootdirectory,directoryname).then(s=>{
     created=true;
  },async err=>{
    console.log("Direct not exist")
     await this.File.createDir(rootdirectory,directoryname,true).then(s=>{
      console.log("Directory Created! at "+rootdirectory);
       created=true;
    },err=>{
      console.log("Created Dir Error")
      console.log(err)
      created=false;
    });
    return created;
  });
  return created;
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
    object=JSON.stringify(object);
    let datadirectory=this.File.dataDirectory;
    let directoryname="StockfolioReports";
    let extrootdirectory=this.File.externalRootDirectory;
    let condition=await this.isCreated(datadirectory,directoryname);
    if (condition) {
      await this.File.createFile(datadirectory+directoryname, filename, true).then(
        (v) => {
          console.log("file created!")
          this.File.writeFile(datadirectory+directoryname, filename, object,{append:true}).then((s)=> {
            // let f= this.isCreated(extrootdirectory,directoryname);
            // if(f)
            //  this.File.moveFile(v.fullPath,filename,extrootdirectory,directoryname);
            console.log("file written!")
          }, err => {
            console.log("writeFile Error")
            console.log(err)
             }).catch(err=>{
              this.File.writeFile(datadirectory+directoryname, filename, object).then((s)=> {
               
                console.log("file written!")
              });
             });
        },
        err => { 
          console.log("createFile Error")
          console.log(err)
         });
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
