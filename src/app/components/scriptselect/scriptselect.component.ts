import { Component, OnInit, Output,EventEmitter, Input, SimpleChanges } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ScriptlistPage } from 'src/app/modal/scriptlist/scriptlist.page';
import { LocalService } from 'src/app/services/local.service';
 

@Component({
  selector: 'app-scriptselect',
  templateUrl: './scriptselect.component.html',
  styleUrls: ['./scriptselect.component.scss'],
})
export class ScriptselectComponent implements OnInit {

 public id:string="";
 public name:string="";

 @Input() reset:boolean=false;

 @Output() emitid=new EventEmitter<string>();
 
 constructor(
    public local:LocalService,
    public viewCrtl:ModalController
  ) { 
   
  }

  ngOnChanges(changes: SimpleChanges){
    if(changes['reset'])[
      
    ]
  }
  ngOnInit() {}
  async OpenScripList(){
    const modal=await this.viewCrtl.create({component:ScriptlistPage});
    modal.onDidDismiss().then(res=>{
      if(res != undefined){
        this.id=res.data.id;
        this.name=res.data.name;
        console.log({id:this.id,name:this.name});
        this.emitScriptId();
      }
     });
    return await modal.present();
   }
   private emitScriptId() {
    this.emitid.emit(this.id);
  }
}
