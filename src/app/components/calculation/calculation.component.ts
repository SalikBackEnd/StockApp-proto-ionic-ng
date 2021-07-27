import { Component, Input, OnInit, Output, SimpleChanges,EventEmitter } from '@angular/core';
import { Tables, TransactionType } from 'src/app/services/helper.service';

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
  constructor(public local:LocalService,public toast:ToastService) { }

  ngOnInit() {
    // this.avgCost=this.AverageShareCost();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['sQuantity'] || changes['amount'] ) {
        // Do your logic here
        if(this.page=='buy'){
          this.totalInvested();
          this.totalCostTnC(this.taxapply);
          // this.emitAmount(this.tInvest);
          
          this.ifNoValue();
        }
        if(this.page=='sell'){
          this.totalInvested();
          this.totalCostTnC(this.taxapply);
          // this.emitAmount(this.tInvest);
          
          this.ifNoValue();
        }
      
    }
    if(changes['scriptid']){
      if(this.page=='sell'){
        this.Sharecount=this.countShareswrtScript(this.scriptid);
      
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
  }
 countShareswrtScript(scriptid){
  let buycount=0;
  let sellcount=0;
  let key=Tables.Transaction;
  let list=this.local.GetData(key);
  if(scriptid != undefined && scriptid !=null){
  if(list != undefined ){
      //this.buyList=list.filter((e,i)=>{return e.id!="" && e.statusid== TransactionType.Buy && e.scriptid== scriptid});
      //this.sellList=list.filter(e=>{return e.id!="" && e.statusid==TransactionType.Sell && e.scriptid== scriptid});
      this.buyList=this.local.scriptsBuyList(scriptid);
      this.sellList=this.local.scriptsSellList(scriptid);
      if(this.buyList.length>0){
        // let quantityobj=this.buyList.map(a=>a.quantity);
        
        // if(this.buyList.length>1)
        // buycount=quantityobj.reduce((a,b)=>a+b,0);
        // else if(this.buyList.length==1)
        // buycount=quantityobj;
        buycount=this.buyList.map(e=>e.quantity).reduce((a,b)=>a+(b||0));
      }
      if(this.sellList.length>0){
        // let quantityobj=this.sellList.map(a=>a.quantity);
        // if(this.sellList.length>1)
        // sellcount=quantityobj.reduce((a,b)=>a+b,0);
        // else if(this.sellList.length==1)
        // sellcount=quantityobj;
        sellcount=this.sellList.map(a=>a.quantity).reduce((a,b)=>a+(b||0),0);
      }
   
      return (buycount-sellcount);
    }else{
      return 0;
    }
  }else{
    return 0;
  }
 }
//  AverageShareCost(){
//   let totalShare=this.local.countTotalShares();
//   let totalAmount=this.local.totalAmount();
//   let avg=totalAmount/totalShare;
//   if(isNaN(avg)){
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
       
      }else if(this.taxapply<0){
        this.totalCostTnC(0);
        this.toast.show("Pleae enter a valid Tax amount.");
     }else{
      this.totalCostTnC(0);
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
        this.tCost=parseFloat((taxcost+tcost).toFixed(2));
      
      }else{
        this.tTax=0;
        this.tCost=parseFloat(tcost.toFixed(3));
        
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
}
