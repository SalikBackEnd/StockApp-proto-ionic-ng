import { Component, OnInit,  Output,EventEmitter, Input, SimpleChanges, ViewChild } from '@angular/core';
import { IonSelect } from '@ionic/angular';
import { LocalService } from 'src/app/services/local.service';

@Component({
  selector: 'app-scriptcombobox',
  templateUrl: './scriptcombobox.component.html',
  styleUrls: ['./scriptcombobox.component.scss'],
})
export class ScriptcomboboxComponent implements OnInit {

  public scriptid:string="";
  private scripts: any = [];

  @Input() sid:string;

  @Output() scriptvalue=new EventEmitter<string>();
  @ViewChild('scriptSelect', { static: false }) scriptSelect: IonSelect;


  constructor(public local:LocalService) {
    this.scripts=local.scriptlist;
   }
ngOnChanges(changes: SimpleChanges){
  if (changes['sid'] ) {
    if(this.sid==null)
    this.resetCombobox();
  }
}
  ngOnInit() {}
  onScriptSelect(value){
    this.scriptid=value;
    this.emitScriptId(value);
  }
  emitScriptId(val){
    this.scriptvalue.emit(val)
  }
  resetCombobox(){
   
    this.scriptSelect.value = "";
  }
  
}
