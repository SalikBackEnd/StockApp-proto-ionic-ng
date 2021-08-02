import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { HelperService } from 'src/app/services/helper.service';
import { LocalService } from 'src/app/services/local.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-payout',
  templateUrl: './payout.page.html',
  styleUrls: ['./payout.page.scss'],
})
export class PayoutPage implements OnInit {

  private Payout={
    id:0,
    scriptid:"",
    type:0,
    tax:0,
    dividend:0,
    bonus:0,
    date:Date.now()
  }

  public selectedscriptid:string=null;

  public dividendChecked=true;
  public bonusChecked=true;

  public valueDividend=0;
  public valueBonus=0;

  

  constructor(
    private local: LocalService,
    private loading: LoadingController,
    private toast: ToastService,
    private helper: HelperService,
    public viewCtrl: ModalController
  ) { 

  }

  ngOnInit() {
  }
  receiveScriptid(value){
    this.selectedscriptid=value;
  }
  
}
