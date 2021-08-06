import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HelperService } from 'src/app/services/helper.service';
import { LocalService } from 'src/app/services/local.service';

@Component({
  selector: 'app-scriptlist',
  templateUrl: './scriptlist.page.html',
  styleUrls: ['./scriptlist.page.scss'],
})
export class ScriptlistPage implements OnInit {

  public List:any=[];
  public Scripts:any=[];
  public beforeSearchList:any=[];
  public limit=20;
  public start=0;
  public end=this.limit-1;
 
  constructor(
    public local:LocalService,
    public helper:HelperService,
    public viewCrtl:ModalController
  ) { 
    this.Scripts=helper.favScriptList;
    this.PopulateScripts();
  }

  ngOnInit() {}

  PopulateScripts(){
   this.start=0;
   this.end=this.limit-1;
    this.List=this.Scripts.slice(this.start,this.end);
    this.start=this.end;
    this.end+=this.limit;
  }

  loadMore(event) {
    setTimeout(() => {

      console.log('Done');
      let newlist = this.Scripts.slice(this.start, this.end);
      if (newlist.length > 0) {
        this.List=this.List.concat(newlist)
        this.start = this.end;
        this.end += this.limit;
      }
      event.target.complete();

      if (this.List.length >= this.Scripts.length) {
        event.target.disabled = true;
      }
      // App logic to determine if all data is loaded
      // and disable the infinite scroll

    }, 500);
  }
  async Dismiss(){
    await this.viewCrtl.dismiss({id:"",name:""});
  }
  async onSelect(id,name){
    await this.viewCrtl.dismiss({id:id,name:name});
  }
  onSearchChange(value){
    if(value != ""){
      let scripts=this.Scripts.filter(x=>x.name.includes(value.toUpperCase()) || x.name.includes(value));
     
      this.List=scripts;
    }else{
      this.PopulateScripts();
    }
  }
}
