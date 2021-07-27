import { Component, OnInit,  Output,EventEmitter, Input, SimpleChanges, ViewChild } from '@angular/core';
import { IonSelect } from '@ionic/angular';
import { HelperService } from 'src/app/services/helper.service';
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


  constructor(private local: LocalService, private helper: HelperService) {
    this.scripts = helper.favScriptList;
  }
   ngOnChanges(changes: SimpleChanges) {
    if (changes['sid']) {
      if (this.sid == null)
        this.resetCombobox();
    }
  }
  ngOnInit() { }
   onScriptSelect(value) {
    this.scriptid = value;
    this.emitScriptId(value);
  }
  private emitScriptId(val) {
    this.scriptvalue.emit(val)
  }
  private resetCombobox() {

    this.scriptSelect.value = "";
  }
  refreshList() {
    this.scripts = this.helper.favScriptList;
  }
}
