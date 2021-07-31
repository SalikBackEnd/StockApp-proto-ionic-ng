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
    return new Promise<string>(async (resolve,rejected)=>{
      console.log(this.platform.platforms());
      if(this.currentPlatform.includes('hybrid'))
       await this.writeJSONAndroid(filename,object).then(
         res=>resolve(res),
         err=>rejected(err)
        );
    });
  
  
  }
  async writeJSONAndroid(filename, object) {
    return new Promise<string>(async (resolve,rejected)=>{
      object = JSON.stringify(object);
    // let datadirectory=this.File.dataDirectory;
    let directoryname = "StockfolioReports";
    let extrootdirectory = this.File.externalRootDirectory;
    let condition = await this.isCreated(extrootdirectory, directoryname);
    if (condition) {
      await this.File.createFile(extrootdirectory + directoryname, filename, true).then(
        async (v) => {
         await this.File.writeFile(extrootdirectory + directoryname, filename, object, { append: true }).then(s => {
            resolve("File Written at '"+extrootdirectory + directoryname+"'");
          }, err => {
            rejected("Error: Report can't be written.");
          }).catch(async err => {
            await this.File.writeFile(extrootdirectory + directoryname, filename, object).then(s => {
              resolve("File Written at '"+extrootdirectory + directoryname+"'");
            });
          });
        },
        err => {
          console.log("createFile Error")
          console.log(err)
          rejected("Error: Report can't be generated.");
        });
    }
    });
    
  }
   writeJSONdesktop(object){
    return new Promise<string>((resolve,reject)=>{
      var theJSON = JSON.stringify(object);
      var uri = this.sanitizer.bypassSecurityTrustUrl("data:text/json;charset=UTF-8," + encodeURIComponent(theJSON));
      this.downloadJsonHref = uri;
      if(this.downloadJsonHref!=(undefined&&null) ){
        resolve("Download link generated");
      }else{
        reject("Error: Download link can't be generated or passes object is null or undefined.");
      }
    });
  }
}
