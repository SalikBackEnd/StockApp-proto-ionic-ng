import { Component, Input, OnInit, Output, SimpleChanges,EventEmitter } from '@angular/core';
import { HelperService, Tables, TransactionType } from 'src/app/services/helper.service';

import { LocalService } from 'src/app/services/local.service';
import { ToastService } from 'src/app/services/toast.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'buy-calculation',
  templateUrl: './calculation.component.html',
  styleUrls: ['./calculation.component.scss'],
})

export class CalculationComponent implements OnInit {

  public tCost:number; //total cost
  public tInvest:number;//per share cost
  public tTax:number;
  public Comission:number;
  public tShares:number;
  public avgCost:number;
  public Sharecount:number;
  public taxapply:number;
  public NewQty:number;
  public CurrentAvg:number;
  public NewAvg:number;

  @Input() sQuantity:number;
  @Input() amount:number;
  @Input() scriptid:number;
  @Input() buttonclick:boolean;
  @Input() page:string;
  @Input() tax:boolean;

  @Output() eTax=new EventEmitter<number>();
  @Output() eCommission=new EventEmitter<number>();
  @Output() eTotalCost=new EventEmitter<number>();
  // @Output() Amount=new EventEmitter<number>();
  public buyList:any=[];
  public sellList:any=[];
  public fullList:any=[];
  constructor(public local:LocalService,public toast:ToastService,public helper:HelperService) { }

  ngOnInit() {
    // this.avgCost=this.AverageShareCost();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['sQuantity'] || changes['amount']) {
      this.totalInvested();
      this.totalCostTnC(this.taxapply);
      this.ifNoValue();
    
      if (this.page == 'demo-buy') {
        if (this.sQuantity > 0 && this.sQuantity != undefined && this.Sharecount > 0 && this.Sharecount != undefined) {
          this.NewQty = this.Sharecount + this.sQuantity;
          if (this.tax)
            this.NewAvg = this.newAverage(this.scriptid, this.sQuantity, this.tCost);
          else
            this.NewAvg = this.newAverage(this.scriptid, this.sQuantity, this.tInvest);
        }
        this.ifNoValue();
        this.demo_buyCodeBlock();
      }
    }
    if (changes['scriptid']) {
      if (this.page == 'sell' || this.page == 'demo-buy') {
        this.Sharecount = this.countShareswrtScript(this.scriptid);
        if (this.sQuantity > 0 && this.sQuantity != undefined)
          this.NewQty = this.Sharecount + this.sQuantity;
        if (this.scriptid > 0 && this.scriptid != null && this.scriptid != undefined)
          this.CurrentAvg = this.currentAverage(this.scriptid);
      }
      this.ifNoValue();
      this.demo_buyCodeBlock();
    }
    if (changes['tax']) {
      this.demo_buyCodeBlock();
    }
  }
  demo_buyCodeBlock(){
    if (this.page == 'demo-buy') {
      if (this.tax){
        if(this.sQuantity>0 && this.tCost>0)
        this.NewAvg = this.newAverage(this.scriptid, this.sQuantity, this.tCost);
        else
        this.NewAvg=0;
      }
      else{
        if(this.sQuantity>0 && this.tInvest>0)
        this.NewAvg = this.newAverage(this.scriptid, this.sQuantity, this.tInvest);
        else
        this.NewAvg=0;
      }
        
    }
  }
  totalInvested(){
    let Quantity= this.sQuantity;
    let Amount=this.amount;
    if(Quantity != undefined && Amount != undefined){
      let Invested=Quantity*Amount;
      this.tInvest=parseFloat(Invested.toFixed(2));
    }else{
      this.tInvest=0;
    }
    this.emitTax();
    this.emitCost();
    this.emitComission();
  }
  // totalCost(){
  //   let invested=this.tInvest;
  //   let cperRupee=0.03;
  //   let percent=0.15;
  //   let perRupeecost=cperRupee+1;
  //   if(invested != 0 && invested != undefined){
      
  //     let tcost=perRupeecost*invested;
  //     let tComission=tcost-invested;
  //     this.tCost=parseFloat(tcost.toFixed(3));
  //     this.Comission=parseFloat(tComission.toFixed(3));
    
  //   }else{
  //     this.tCost=0;
  //     this.Comission=0;
  //   }
  // }
  ifNoValue(){
    if(this.tCost==undefined ||this.tCost==null || isNaN(this.tCost)){
      this.tCost=0;
    }
    if(this.Comission==undefined ||this.Comission==null || isNaN(this.Comission)){
      this.Comission=0;
    }
    if(this.tInvest==undefined ||this.tInvest==null || isNaN(this.tInvest)){
      this.tInvest=0;
    }
    if(this.CurrentAvg==undefined ||this.CurrentAvg==null || isNaN(this.CurrentAvg)){
      this.CurrentAvg=0;
    }
    if(this.NewQty==undefined ||this.NewQty==null || isNaN(this.NewQty)){
      this.NewQty=0;
    }
  }
 countShareswrtScript(id){
  let buycount=0;
  let sellcount=0;
  if(id != undefined && id !=null){
  buycount=this.helper.scriptsBuyQuantity(id);
  sellcount=this.helper.scriptsSellQuantity(id);
  return (buycount-sellcount);
  }else{
    return 0;
  }
 }
//  AverageShareCost(){
//   let totalShare=this.local.countTotalShares();
//   let totalAmount=this.local.totalAmount();
//   let avg=totalAmount/totalShare;
//   //(isNaN(avg)){
//     return 0;
//   }
//   return parseFloat(avg.toFixed(2));
//  }
  // emitAmount(value:number){
  //   this.Amount.emit(value);
  // }
  onTaxChange(){
      if(this.taxapply>=0){
        this.totalCostTnC(this.taxapply);
        //if tax change Avg also changes
        this.NewAvg=this.newAverage(this.scriptid,this.sQuantity,this.tCost);
      }else if(this.taxapply<0){
        this.totalCostTnC(0);
        this.NewAvg=this.newAverage(this.scriptid,this.sQuantity,this.tCost);
        this.toast.show("Pleae enter a valid Tax amount.");
     }else{
      this.totalCostTnC(0);
      this.NewAvg=this.newAverage(this.scriptid,this.sQuantity,this.tCost);
      this.toast.show("Enter a valid Tax amount.");
     }

  }
  totalCostTnC(tax){
    let invested=this.tInvest;
    let quantity=this.sQuantity;
    let cperShare=0;
    let cps_paisa=0;
    let cps_percent=0;
    let percent=0.15;
    // if(this.amount<5){
    //   cperShare=0.03+this.amount;
    // }else{
    //   cperShare=((percent/100)*this.amount)+this.amount;
    //   if(cperShare<(0.03+this.amount))cperShare=0.03+this.amount;
    // }
    cps_paisa=0.03+this.amount;
    cps_percent=((percent/100)*this.amount)+this.amount;
    if(cps_paisa>cps_percent)cperShare=cps_paisa;
    if(cps_percent>=cps_paisa)cperShare=cps_percent;
  
    let totalSharecost=cperShare*quantity;
    if(invested != 0 && invested != undefined){
      let tcost=totalSharecost;
      let tComission=tcost-invested;
      if(tax>0 && tax != undefined){
        
        let taxcost=tax*quantity;
        this.tTax=taxcost;
        if(this.page=="buy" || this.page == "demo-buy")
        this.tCost=parseFloat((taxcost+tcost).toFixed(2));
        if(this.page=="sell")
        this.tCost=parseFloat(((tcost-taxcost)-(tComission*2)).toFixed(2));
      }else{
        this.tTax=0;
        if(this.page=="buy" || this.page == "demo-buy") 
        this.tCost=parseFloat(tcost.toFixed(3));
        if(this.page=="sell")
        this.tCost=parseFloat((tcost-(tComission*2)).toFixed(3));
        
      }
      this.Comission=parseFloat(tComission.toFixed(3));
    
    }else{
      this.tCost=0;
      this.Comission=0;
   
    }
    this.emitTax();
    this.emitCost();
    this.emitComission();
  }
  emitTax(){
    this.eTax.emit(this.tTax);
  }
  emitComission(){
    this.eCommission.emit(this.Comission);
  }
  emitCost(){
    this.eTotalCost.emit(this.tCost);
  }
  currentAverage(id){
   return this.helper.AverageCostbyTotalCost(id);
  }
  newAverage(id,newQuantity,newAmount){
    // newAmount=(this.CurrentAvg+this.amount)/2;
    // newAmount=newQuantity*newAmount;
    return this.helper.AverageCostbyTotalCost(id,null,newQuantity,newAmount);
  }
}
