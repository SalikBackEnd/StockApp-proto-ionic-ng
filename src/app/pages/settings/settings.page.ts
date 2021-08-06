import { Component, OnInit } from '@angular/core';
import { HelperService, Tables } from 'src/app/services/helper.service';
import { LocalService } from 'src/app/services/local.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  public Darkmode:boolean=false;
  public isTaxInclude:boolean=false;

  constructor(
    public local:LocalService,
    public helper:HelperService
  ) { 
    this.Darkmode=this.local.isdarkmode;
    this.isTaxInclude=this.local.isTaxInclude;
  }

  ngOnInit() {
  }
  onClickDarkmode(event){
    let systemDark = window.matchMedia("(prefers-color-scheme: dark)");
    systemDark.addListener(this.colorTest);
    if(event.detail.checked){
      document.body.setAttribute('data-theme', 'dark');
      this.local.SetData(Tables.Darkmode,true);
    }
    else{
      document.body.setAttribute('data-theme', 'light');
      this.local.SetData(Tables.Darkmode,false);
    }
  }
  colorTest(systemInitiatedDark) {
    if (systemInitiatedDark.matches) {
      document.body.setAttribute('data-theme', 'dark');
      
    } else {
      document.body.setAttribute('data-theme', 'light');
     
    }
  }
  onClickTax(event){
    if(event.detail.checked){
      this.local.SetData(Tables.TaxnComission,true);
      this.local.isTaxInclude=true;
    }else{
      this.local.SetData(Tables.TaxnComission,false);
      this.local.isTaxInclude=false;
    }
  }
}
