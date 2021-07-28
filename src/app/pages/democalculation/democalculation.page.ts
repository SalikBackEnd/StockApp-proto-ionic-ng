import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CalculationComponent } from 'src/app/components/calculation/calculation.component';
import { ScriptcomboboxComponent } from 'src/app/components/scriptcombobox/scriptcombobox.component';
import { HelperService } from 'src/app/services/helper.service';
import { LocalService } from 'src/app/services/local.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-democalculation',
  templateUrl: './democalculation.page.html',
  styleUrls: ['./democalculation.page.scss'],
})
export class DemocalculationPage implements OnInit {

  public page:string="demo-buy";
  public resetscriptid:string="";
  public selectedScript:string="0";
  textQty: string = '';
  textPrice: string = '';
  Tax: any = false;
 
  public Quantity: number = 0;
  public Amount: number = 0;
  public totalcost=0;
  public tax=0;
  public comission=0;
  @ViewChild(ScriptcomboboxComponent) Scriptcombox:ScriptcomboboxComponent;
  @ViewChild(CalculationComponent) Calculations:CalculationComponent;
  constructor(public local: LocalService,public helper:HelperService, public toast: ToastService,public viewCtrl: ModalController) { }

  ngOnInit() {
  }
  ionViewDidEnter(){
    this.helper.GetFavScripts();
    this.Scriptcombox.refreshList();
  }
  receiveTax(value:number){
    this.tax=value;
  }
  receiveComission(value:number){
    this.comission=value;
  }
  receiveCost(value:number){
    this.totalcost=value;
  }
  receiveScriptid(value:string){
    this.selectedScript=value;
  }
  Dismiss() {
    this.viewCtrl.dismiss({ somedata: 'Dismissed' });
  }
  onQuantityInput(value) {
    let v = parseInt(value);
    if (v > 0) {
      this.Quantity = v;
    }
    else {
      this.Calculations.sQuantity=0;
      this.Calculations.NewQty=0;
      this.Calculations.NewAvg=0;
      this.Quantity=0;
      this.toast.show("Enter a valid Quantity!",500);
    }
  }
  onAmountInput(value) {
    let v = parseFloat(value);
    if (v > 0) {
      this.Amount = v;
    }
    else {
      this.Calculations.amount=0;
      this.Calculations.NewAvg=0;
      this.Amount=0;
      this.toast.show("Enter a valid Amount!",500);
    }
  }
  onCheck() {
    this.local.onIncludeTaxCheck(this.Tax, this.toast);
  }
}
