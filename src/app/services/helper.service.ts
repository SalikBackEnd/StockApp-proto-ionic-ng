import { Injectable } from '@angular/core';
import { LocalService } from './local.service';

export enum TransactionType{
  Buy=0,
  Sell=1
}
//new table of key will be added here
export enum Tables{
  Transaction="trnsctlog",
}
export enum PnL{
  Profit=1,
  Loss=2
}
@Injectable({
  providedIn: 'root'
})

export class HelperService {
//create enum here


  constructor(public local:LocalService) { }
  scriptsBuyQuantity(sid){
    let list:any=[];
    let filtered:any=[];
    list=this.local.GetData(Tables.Transaction);
    if(list != undefined){
      filtered= list.filter(e=>(e.id!="")&&(e.statusid==TransactionType.Buy)&&(e.scriptid==sid));
    if(filtered.length>0){
      let quantity=filtered.map(e=>e.quantity).reduce((a,b)=>a+(b||0),0);
      return quantity;
    }else{
      return 0;
    }
    }
    else
    return 0;
  }
  scriptsSellQuantity(sid){
    let list:any=[];
    list=this.local.GetData(Tables.Transaction);
    if(list != undefined){
    let filtered= list.filter(e=>(e.id!="")&&(e.statusid==TransactionType.Sell)&&(e.scriptid==sid));
    if(filtered.length>0){
      let quantity=filtered.map(e=>e.quantity).reduce((a,b)=>a+(b||0),0);
      return quantity;
    }else{
      return 0;
    }
    }
    else
    return 0;
  }
  AverageShareCost(quantity:number,amount:number){
    let avg=amount/quantity;
    if(isNaN(avg)){
      return 0;
    }
    return parseFloat(avg.toFixed(2));
   }
  
   scriptTotalAmount(id){
    let buylist:any=[];
    let selllist:any=[];
    let bAList:any=[];
    let sAList:any=[];
    let bAmount=0;
    let sAmount=0;
    buylist=this.local.scriptsBuyList(id);
    selllist=this.local.scriptsSellList(id);
    if(buylist.length>0){
      buylist.forEach(e=> {
        let amount=e.price*e.quantity;
        bAList.push(amount);
        console.log("Buy= Price into Quantity of scriptId:"+id)
        console.log(amount)
      });
      if(bAList.length>0){
        bAmount=bAList.reduce((a,b)=>a+(b||0),0);
      }
    }
    if(selllist.length>0){
      selllist.forEach(e => {
        sAList.push(e.price*e.quantity);
      });
      if(sAList.length>0){
        sAmount=sAList.reduce((a,b)=>a+(b||0),0);
      }
    }
    let tAmount=bAmount-sAmount;
    if(tAmount<0)
      tAmount=sAmount-bAmount;
      return tAmount;
   }

scriptTotalQuantity(scriptid) {
  let buycount = 0;
  let sellcount = 0;
  buycount=this.scriptsBuyQuantity(scriptid);
  sellcount=this.scriptsSellQuantity(scriptid);
  
  return (buycount-sellcount);
}


  AverageScriptCost(scriptid){
    return this.AverageShareCost(this.scriptTotalQuantity(scriptid),this.scriptTotalAmount(scriptid));
  }
SoldDates(){
  let sell=this.local.SellList();
  let date=sell.map(e=>e.date);
  let datestring=sell.map(e=>new Date(e.date).toDateString());
  date=datestring.filter(this.onlyUnique);
  console.log("In Sold Dates Method");
  console.log(datestring)
  if(date.length>0)
  return date;
  else
  return [];
}
onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}
getTransactionbyDate(date:number,sellList:Array<any>){
  let d=new Date(date);
  d.setHours(0,0,0,0);
  let list:any=[];
  list=sellList.filter(e=>{
   let dt=new Date(e.date);
   dt.setHours(0,0,0,0);
   if(d.toDateString()==dt.toDateString())
   return true;
   else
   return false;
  });
  if(list != undefined && list.length>0)
  return list;
  else
  return [];
}
    scriptBuyListBeforeSell(scriptid,selldate){
      let buyList=this.local.scriptsBuyList(scriptid);
            let beforetransaction=buyList.filter(el=>{
              let dt=el.date;
              if(selldate>dt)
              return true;
              else
              return false;
            });
            if(beforetransaction.length>0){
              return beforetransaction;
            }
            else{
              return [];
            }
           
            
    }
    getTotalPrices(list){
      if(list.length>0){
        let totalprice=list.map(e=>e.price).reduce((a,b)=>a+(b||0),0);
        return totalprice;
      }else{
        return 0;
      }
    }
    getBuyAvgPrice(scriptid,selldate){
      let totalprice=0;
      let numberoftrans=0;
      let list=this.scriptBuyListBeforeSell(scriptid,selldate);
      totalprice=this.getTotalPrices(list);
     if(totalprice>0){
      numberoftrans=list.length;
      let avgbuyprice=totalprice/numberoftrans;
      return avgbuyprice;
     }else{
       return 0;
     }
    }
    getProfitnLoss(scriptid,buyprice,sellprice,date){
      let buyamount=buyprice*this.SellQuantitybyDatenScript(date,scriptid);
      let sellamount=sellprice*this.SellQuantitybyDatenScript(date,scriptid);
      let gained=sellamount-buyamount;
      if(gained<0){
        gained=buyamount-sellamount;
        return {pnlstate:PnL.Loss,amount:gained}
      }else if(gained>=0){
        return {pnlstate:PnL.Profit,amount:gained};
      }
    }
    SellQuantitybyDatenScript(date,scriptid){
      let list:any=[];
      list=this.local.GetData(Tables.Transaction);
      if(list != undefined){
      let filtered= list.filter(e=>(e.id!="")&&(e.statusid==TransactionType.Sell)&&(e.scriptid==scriptid));
      filtered=filtered.filter(e=>{
        let dt=e.date;
        if(date==dt)
        return true;
        else
        return false;
      });
      if(filtered.length>0){
        let quantity=filtered.map(e=>e.quantity).reduce((a,b)=>a+(b||0),0);
        return quantity;
      }else{
        return 0;
      }
      }
      else
      return 0;
    }
    getScriptNameFromList(scriptid,List){
      if(List != undefined && List.length>0){
        let script=List.find(e=>e.id==scriptid);
        if(script != undefined){
          return script.name;
        }
      }
      return "";
    }
}
