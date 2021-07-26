import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { HelperService } from 'src/app/services/helper.service';
import { LocalService } from 'src/app/services/local.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-scripts',
  templateUrl: './scripts.page.html',
  styleUrls: ['./scripts.page.scss'],
})
export class ScriptsPage implements OnInit {

  public scripts:any=[];
  constructor(public local:LocalService,public helper:HelperService,public toast: ToastService,public loadingController:LoadingController,public viewCtrl:ModalController) 
  {
    this.scripts=local.scriptlist;

   }

  ngOnInit() {
  }
  Dismiss(){
    this.viewCtrl.dismiss({somedata:'Dismissed'});
  }
}
