import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

import { LocalService } from './local.service';

export enum Platforms{
  Web=1,
  Mobile=2,
  
}
export enum Payout{
  Dividend=1,
  Bonus=2
}

export enum TransactionType {
  Buy = 0,
  Sell = 1,
  Both=2
}
//new table of key will be added here
export enum Tables {
  Transaction = "trnsctlog",
  FavScripts="favScripts",
  Payout="payouts",
}
export enum PnL {
  Profit = 1,
  Loss = 2
}
export enum DataTypes{
  Number="number",
  String="string",
  Boolean="boolean",
  Object="object",
  Array="array"
}

@Injectable({
  providedIn: 'root'
})

export class HelperService {
  //create enum here

  public favScriptList:any=[];
  public myplatform:Platforms=null;
  constructor(public local: LocalService,private platform:Platform) {
    this.GetFavScripts();
    this.myplatform=this.getPlatForm();
   }
  scriptsBuyQuantity(sid,list: any = []) {
    
    let filtered: any = [];
    if(list.length==0)
    list= this.local.scriptsBuyList(sid);
   // list = this.local.GetData(Tables.Transaction);
      let payoutqty=this.PayoutQuantitybyScript(sid);
    if (list != undefined) {
      filtered = list;
      if (filtered.length > 0) {
        let quantity = filtered.map(e => e.quantity).reduce((a, b) => a + (b || 0), 0);
        return quantity+payoutqty;
      } else {
        return 0;
      }
    }
    else
      return 0;
  }
  scriptsSellQuantity(sid,list: any = []) {
    let filtered: any = [];
    if(list.length==0)
    list= this.local.scriptsSellList(sid);
   // list = this.local.GetData(Tables.Transaction);
    if (list != undefined) {
      //let filtered = list.filter(e => (e.id != "") && (e.statusid == TransactionType.Sell) && (e.scriptid == sid));
      filtered=list;
      if (filtered.length > 0) {
        let quantity = filtered.map(e => e.quantity).reduce((a, b) => a + (b || 0), 0);
        return quantity;
      } else {
        return 0;
      }
    }
    else
      return 0;
  }
  AverageShareCost(quantity: number, amount: number) {
    let avg = amount / quantity;
    if (isNaN(avg)) {
      return 0;
    }
    return parseFloat(avg.toFixed(2));
  }

  scriptTotalAmount(id) {
    let buylist: any = [];
    let selllist: any = [];
    let bAList: any = [];
    let sAList: any = [];
    let bAmount = 0;
    let sAmount = 0;
    buylist = this.local.scriptsBuyList(id);
    selllist = this.local.scriptsSellList(id);
    if (buylist.length > 0) {
      buylist.forEach(e => {
        let amount = e.price * e.quantity;
        bAList.push(amount);
        console.log("Buy= Price into Quantity of scriptId:" + id)
        console.log(amount)
      });
      if (bAList.length > 0) {
        bAmount = bAList.reduce((a, b) => a + (b || 0), 0);
      }
    }
    if (selllist.length > 0) {
      selllist.forEach(e => {
        sAList.push(e.price * e.quantity);
      });
      if (sAList.length > 0) {
        sAmount = sAList.reduce((a, b) => a + (b || 0), 0);
      }
    }
    let tAmount = bAmount - sAmount;
    if (tAmount < 0)
      tAmount = sAmount - bAmount;
    return tAmount;
  }
  scriptTotalBuyAmount(id) {
    let buylist: any = [];
   
    let bAList: any = [];
    
    let bAmount = 0;
 
    buylist = this.local.scriptsBuyList(id);
   
    if (buylist.length > 0) {
      buylist.forEach(e => {
        let amount = e.price * e.quantity;
        bAList.push(amount);
        console.log("Buy= Price into Quantity of scriptId:" + id)
        console.log(amount)
      });
      if (bAList.length > 0) {
        bAmount = bAList.reduce((a, b) => a + (b || 0), 0);
      }
    }
   
    let tAmount = bAmount ;
    return tAmount;
  }
  scriptTotalQuantity(scriptid) {
    let buycount = 0;
    let sellcount = 0;
    buycount = this.scriptsBuyQuantity(scriptid);
    sellcount = this.scriptsSellQuantity(scriptid);

    return (buycount - sellcount);
  }
  scriptTotalBuyQuantity(scriptid) {
    let buycount = 0;
    buycount = this.scriptsBuyQuantity(scriptid);
    return (buycount);
  }
  scriptTotalSellQuantity(scriptid) {
    let buycount = 0;
    buycount = this.scriptsSellQuantity(scriptid);
    return (buycount);
  }

  AverageScriptCost(scriptid) {
    return this.AverageShareCost(this.scriptTotalBuyQuantity(scriptid), this.scriptTotalBuyAmount(scriptid));
  }
  SoldDates() {
    let sell = this.local.SellList();
    let date = sell.map(e => e.date);
    let datestring = sell.map(e => new Date(e.date).toDateString());
    date = datestring.filter(this.onlyUnique);
    console.log("In Sold Dates Method");
    console.log(datestring)
    if (date.length > 0)
      return date;
    else
      return [];
  }
  PayoutDates(){
    let payout = this.PayoutList();
    let date = payout.map(e => e.date);
    let datestring = payout.map(e => new Date(e.date).toDateString());
    date = datestring.filter(this.onlyUnique);
    console.log("In Payout Dates Method");
    console.log(datestring)
    if (date.length > 0)
      return date;
    else
      return [];
  }
  // PayoutDatesByScript(){

  // }
  SoldDatesByScript(id,from:Date=null,to:Date=null) {
    let sell = this.ListSearch(TransactionType.Sell,from,to,id);
    if(sell.length>0){
      let date = sell.map(e => e.date);
      let datestring = sell.map(e => new Date(e.date).toDateString());
      date = datestring.filter(this.onlyUnique);
      console.log("In Sold Dates Method");
      console.log(datestring)
      if (date.length > 0)
        return date;
      else
        return [];
    }
    else
      return [];
  }
  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
  getTransactionbyDate(date:string, sellList: Array<any>) {
    let d = new Date(date);
    d.setHours(0, 0, 0, 0);
    let list: any = [];
    list = sellList.filter(e => {
      let dt = new Date(e.date);
      dt.setHours(0, 0, 0, 0);
      if (d.toDateString() == dt.toDateString())
        return true;
      else
        return false;
    });
    if (list != undefined && list.length > 0)
      return list;
    else
      return [];
  }
  scriptBuyListBeforeSell(scriptid, selldate) {
    let buyList = this.local.scriptsBuyList(scriptid);
    let beforetransaction = buyList.filter(el => {
      let dt = el.date;
      if (selldate > dt)
        return true;
      else
        return false;
    });
    if (beforetransaction.length > 0) {
      return beforetransaction;
    }
    else {
      return [];
    }
  }
  scriptSellListBeforeSell(scriptid, selldate) {
    let sellList = this.local.scriptsSellList(scriptid);
    let beforetransaction = sellList.filter(el => {
      let dt = el.date;
      if (selldate > dt)
        return true;
      else
        return false;
    });
    if (beforetransaction.length > 0) {
      return beforetransaction;
    }
    else {
      return [];
    }
  }
  getTotalPrices(list) {
    if (list.length > 0) {
      let totalprice = list.map(e => e.price).reduce((a, b) => a + (b || 0), 0);
      return totalprice;
    } else {
      return 0;
    }
  }
  getBuyAvgPrice(scriptid, selldate) {
    let totalprice = 0;
    let numberoftrans = 0;
    let list = this.scriptBuyListBeforeSell(scriptid, selldate);
    totalprice = this.getTotalPrices(list);
    if (totalprice > 0) {
      numberoftrans = list.length;
      let avgbuyprice = totalprice / numberoftrans;
      avgbuyprice=parseFloat(avgbuyprice.toFixed(2));
      return avgbuyprice;
    } else {
      return 0;
    }
  }
  getProfitnLoss(scriptid, buyprice, sellprice, date) {
    let buyamount = buyprice * this.SellQuantitybyDatenScript(date, scriptid);
    let sellamount = sellprice * this.SellQuantitybyDatenScript(date, scriptid);
    let gained = sellamount - buyamount;
    if (gained < 0) {
      gained = buyamount - sellamount;
      gained=parseFloat(gained.toFixed(2));
      return { pnlstate: PnL.Loss, amount: gained }
    } else if (gained >= 0) {
      return { pnlstate: PnL.Profit, amount: gained };
    }
  }
  SellQuantitybyDatenScript(date, scriptid) {
    let list: any = [];
    list = this.local.GetData(Tables.Transaction);
    
    if (list != undefined) {
      let filtered = list.filter(e => (e.id != "") && (e.statusid == TransactionType.Sell) && (e.scriptid == scriptid));
      filtered = filtered.filter(e => {
        let dt = e.date;
        if (date == dt)
          return true;
        else
          return false;
      });
      if (filtered.length > 0) {
        let quantity = filtered.map(e => e.quantity).reduce((a, b) => a + (b || 0), 0);
        return quantity;
      } else {
        return 0;
      }
    }
    else
      return 0;
  }
  getScriptNameFromList(scriptid, List) {
    if (List != undefined && List.length > 0) {
      let script = List.find(e => e.id == scriptid);
      if (script != undefined) {
        return script.name;
      }
    }
    return "";
  }

  ListSearch(Transaction: number = TransactionType.Buy, fromDate: Date = null, toDate: Date = null,scriptid=null) {
    let list: any = [];
    list = this.local.GetData(Tables.Transaction);
    if (Transaction == TransactionType.Buy || Transaction == TransactionType.Sell || Transaction == TransactionType.Both) {
      if (fromDate == null && toDate ==null) {
        if (list != undefined && Array.isArray(list)) {
          return list.filter(e => {
            if (scriptid == null || scriptid == "" || scriptid == undefined)
              if (Transaction != TransactionType.Both)
                return (e.id != "" || e.id != 0) && (e.statusid == Transaction);
              else
                return (e.id != "" || e.id != 0);
            if (scriptid != null && scriptid != "" && scriptid != undefined)
              if (Transaction != TransactionType.Both)
                return (e.id != "" || e.id != 0) && (e.statusid == Transaction) && (e.scriptid == scriptid);
              else
                return (e.id != "" || e.id != 0) && (e.scriptid == scriptid);
          });
        }
        else
          return [];
      } else if (fromDate != null && toDate == null) {
        if (list != undefined && Array.isArray(list)) {
          return list.filter(e => {
            if (scriptid == null || scriptid == "" || scriptid == undefined) {
              if (Transaction != TransactionType.Both)
                return (e.id != "" || e.id != 0) && (e.statusid == Transaction) && (this.compareDateFrom(e.date, fromDate));
              else
                return (e.id != "" || e.id != 0) && (this.compareDateFrom(e.date, fromDate));
            }
            if (scriptid != null && scriptid != "" && scriptid != undefined) {
              if (Transaction != TransactionType.Both)
                return (e.id != "" || e.id != 0) && (e.statusid == Transaction) && (e.scriptid == scriptid) && (this.compareDateFrom(e.date, fromDate));
              else
                return (e.id != "" || e.id != 0) && (e.scriptid == scriptid) && (this.compareDateFrom(e.date, fromDate));
            }
          });
        }
        else
          return [];
      } else if (fromDate != null && toDate != null) {
        if (list != undefined && Array.isArray(list)) {
          return list.filter(e => {
            if (scriptid == null || scriptid == "" || scriptid == undefined) {
              if (Transaction != TransactionType.Both)
                return (e.id != "" || e.id != 0) && (e.statusid == Transaction) && (this.compareDateFrom(e.date, fromDate)) && (this.compareDateTo(e.date, toDate));
              else
                return (e.id != "" || e.id != 0) && (this.compareDateFrom(e.date, fromDate)) && (this.compareDateTo(e.date, toDate));
            }
            if (scriptid != null && scriptid != "" && scriptid != undefined) {
              if (Transaction != TransactionType.Both)
                return (e.id != "" || e.id != 0) && (e.statusid == Transaction) && (e.scriptid == scriptid) && (this.compareDateFrom(e.date, fromDate)) && (this.compareDateTo(e.date, toDate));
              else
                return (e.id != "" || e.id != 0) && (e.scriptid == scriptid) && (this.compareDateFrom(e.date, fromDate)) && (this.compareDateTo(e.date, toDate));
            }
          });
        }
        else
          return [];
      } else if (fromDate == null && toDate != null) {
        if (list != undefined && Array.isArray(list)) {
          return list.filter(e => {
            if (scriptid == null || scriptid == "" || scriptid == undefined) {
              if (Transaction != TransactionType.Both)
                return (e.id != "" || e.id != 0) && (e.statusid == Transaction) && (this.compareDateTo(e.date, toDate));
              else
                return (e.id != "" || e.id != 0) && (this.compareDateTo(e.date, toDate));
            }
            if (scriptid != null && scriptid != "" && scriptid != undefined) {
              if (Transaction != TransactionType.Both)
                return (e.id != "" || e.id != 0) && (e.statusid == Transaction) && (e.scriptid == scriptid) && (this.compareDateTo(e.date, toDate));
              else
                return (e.id != "" || e.id != 0) && (e.scriptid == scriptid) && (this.compareDateTo(e.date, toDate));
            }
        });
        }
        else
          return [];
      }
    } else {
      return [];
    }
  }
  compareDateFrom(currentdate: Date, fromDate: Date) {
    if (currentdate != null && fromDate != null) {
      currentdate = new Date(currentdate);
      let cdate = new Date(currentdate).toISOString();
      let fDate = new Date(fromDate).toISOString();
      cdate = cdate.substr(0, 10);
      fDate = fDate.substr(0, 10);
      let bool = cdate >= fDate;
      return bool;
    }
  }
  compareDateTo(currentdate: Date, toDate: Date) {
    if (currentdate != null && toDate != null) {
      currentdate = new Date(currentdate);
      let cdate = new Date(currentdate).toISOString();
      let tDate = new Date(toDate).toISOString();
      cdate = cdate.substr(0, 10);
      tDate = tDate.substr(0, 10);
      let bool = cdate <= tDate;
      return bool;
    }
  }
  scriptTotalBuyQuantityBeforeDate(scriptid,Date) {
    let buycount = 0;
    buycount = this.scriptsBuyQuantity(scriptid,this.scriptBuyListBeforeSell(scriptid,Date));
    return (buycount);
  }
  scriptTotalSellQuantityBeforeDate(scriptid,Date) {
    let sellcount = 0;
    sellcount = this.scriptsSellQuantity(scriptid,this.scriptSellListBeforeSell(scriptid,Date));
    return (sellcount);
  }
  scriptTotalBuyAmountBeforeDate(id,Date,totalcost=false) {
    let buylist: any = [];
   
    let bAList: any = [];
    
    let bAmount = 0;
 
    buylist = this.scriptBuyListBeforeSell(id,Date);
   if(totalcost==false){
    if (buylist.length > 0) {
      buylist.forEach(e => {
        let amount = e.price * e.quantity;
        bAList.push(amount);
      });
      if (bAList.length > 0) {
        bAmount = bAList.reduce((a, b) => a + (b || 0), 0);
      }
    }
  }else if(totalcost ==true){
    if (buylist.length > 0) {
      buylist.forEach(e => {
        let amount = e.totalcost;
        bAList.push(amount);
      });
      if (bAList.length > 0) {
        bAmount = bAList.reduce((a, b) => a + (b || 0), 0);
      }
    }
  }
    let tAmount = bAmount ;
    return tAmount;
  }
  scriptTotalSellAmountBeforeDate(id,Date,totalcost=false) {
    let selllist: any = [];
   
    let sAList: any = [];
    
    let sAmount = 0;
 
    selllist = this.scriptSellListBeforeSell(id,Date);
   if(totalcost==false){
    if (selllist.length > 0) {
      selllist.forEach(e => {
        let amount = e.price * e.quantity;
        sAList.push(amount);
      });
      if (sAList.length > 0) {
        sAmount = sAList.reduce((a, b) => a + (b || 0), 0);
      }
    }
  }else if(totalcost ==true){
    if (selllist.length > 0) {
      selllist.forEach(e => {
        let amount = e.totalcost;
        sAList.push(amount);
      });
      if (sAList.length > 0) {
        sAmount = sAList.reduce((a, b) => a + (b || 0), 0);
      }
    }
  }
    let tAmount = sAmount ;
    return tAmount;
  }
  AverageCostBeforeDate(scriptid,Date) {
    return this.AverageShareCost(this.scriptTotalBuyQuantityBeforeDate(scriptid,Date), this.scriptTotalBuyAmountBeforeDate(scriptid,Date));
  }
  scriptTotalBuyCost(id) {
    let buylist: any = [];
    let bAList: any = [];
    let bAmount = 0;
    buylist = this.local.scriptsBuyList(id);
    if (buylist.length > 0) {
      buylist.forEach(e => {
        let amount = e.totalcost;
        bAList.push(amount);
      });
      if (bAList.length > 0) {
        bAmount = bAList.reduce((a, b) => a + (b || 0), 0);
      }
    }
    let tAmount = bAmount ;
    return tAmount;
  }
  scriptTotalSellCost(id) {
    let selllist: any = [];
    let sAList: any = [];
    let sAmount = 0;
    selllist = this.local.scriptsSellList(id);
    if (selllist.length > 0) {
      selllist.forEach(e => {
        let amount = e.totalcost;
        sAList.push(amount);
      });
      if (sAList.length > 0) {
        sAmount = sAList.reduce((a, b) => a + (b || 0), 0);
      }
    }
    let tAmount = sAmount ;
    return tAmount;
  }
  AverageCostbyTotalCost(scriptid,Date=null,MoreQuantity:number=null,MoreAmount:number=null) {
    if(Date==null ){
      if(MoreAmount  != (null||undefined||0) && MoreQuantity  != (null||undefined||0)){
        return this.AverageShareCost(this.scriptTotalBuyQuantity(scriptid) + MoreQuantity, this.scriptTotalBuyCost(scriptid)+MoreAmount);
      }else{
        return this.AverageShareCost(this.scriptTotalBuyQuantity(scriptid), this.scriptTotalBuyCost(scriptid));
      }
    }
    if(Date!=null)
    return this.AverageShareCost(this.scriptTotalBuyQuantityBeforeDate(scriptid,Date), this.scriptTotalBuyAmountBeforeDate(scriptid,Date,true));
    
  }
  // Sell avg. cost Method
   ActualSellCostbyTotalCost(quantity:number,actualamount:number) {
    let avgsellprice=actualamount/quantity;
    avgsellprice=parseFloat(avgsellprice.toFixed(2));
    return avgsellprice;
  }
  SortHelper(Array,sortDataType){
    if(sortDataType=="boolean"){
     let arr:any=[];
     arr=Array.sort(function(x, y) {
        // true values first
        return (x.fav === y.fav)? 0 : x.fav? -1 : 1;
        // false values first
        // return (x === y)? 0 : x? 1 : -1;
    });
    return arr;
    }
  }
  
  isArrEqual(value,other){
    
    var isEqual = function (value, other) {

      // Get the value type
      var type = Object.prototype.toString.call(value);
    
      // If the two objects are not the same type, return false
      if (type !== Object.prototype.toString.call(other)) return false;
    
      // If items are not an object or array, return false
      if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false;
    
      // Compare the length of the length of the two items
      var valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
      var otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
      if (valueLen !== otherLen) return false;
    
      // Compare two items
      var compare = function (item1, item2) {
    
        // Get the object type
        var itemType = Object.prototype.toString.call(item1);
    
        // If an object or array, compare recursively
        if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
          if (!isEqual(item1, item2)) return false;
        }
    
        // Otherwise, do a simple comparison
        else {
    
          // If the two items are not the same type, return false
          if (itemType !== Object.prototype.toString.call(item2)) return false;
    
          // Else if it's a function, convert to a string and compare
          // Otherwise, just compare
          if (itemType === '[object Function]') {
            if (item1.toString() !== item2.toString()) return false;
          } else {
            if (item1 !== item2) return false;
          }
    
        }
      };
    
      // Compare properties
      if (type === '[object Array]') {
        for (var i = 0; i < valueLen; i++) {
          if (compare(value[i], other[i]) === false) return false;
        }
      } else {
        for (var key in value) {
          if (value.hasOwnProperty(key)) {
            if (compare(value[key], other[key]) === false) return false;
          }
        }
      }
    
      // If nothing failed, return true
      return true;
    
    };
    return isEqual(value,other);
  }
  GetFavScripts(){
    let favScripts:any=[];
    favScripts= this.local.GetData(Tables.FavScripts);
    if(favScripts!=undefined && favScripts.length>0){
     
      this.favScriptList=this.SortHelper(favScripts,DataTypes.Boolean); //return a sorted list of array with true values first
      
    }else{
      this.favScriptList= [];
    }
  }
  getPlatForm(){
    let p:any=[];
    p=this.platform.platforms();
    if(p.includes("desktop")){
      return Platforms.Web;
    }else if(p.includes("hybrid") || p.includes("capacitor")){
      return Platforms.Mobile;
    }else if(p.includes("mobileweb")){
      return Platforms.Web;
    }
    
  }
  TotalCostbyScript(id){
    return this.scriptTotalBuyCost(id)-this.scriptTotalSellCost(id);
  }
  PayoutList(){
    let list=this.local.GetData(Tables.Payout);
    if(list!=null){
      return list;
    }else{
      return [];
    }
  }
  getPayoutsbyDate(date: Date, payoutlist: Array<any>) {
    let d = new Date(date);
    d.setHours(0, 0, 0, 0);
    let list: any = [];
   
    if (payoutlist.length > 0) {
      list = payoutlist.filter(e => {
        let dt = new Date(e.date);
        dt.setHours(0, 0, 0, 0);
        if (d.toDateString() == dt.toDateString())
          return true;
        else
          return false;
      });
    }
    if (list != undefined && list.length > 0)
      return list;
    else
      return [];
  }
  PayoutQuantitybyScript(id){
    let list:any=[];
    list=this.PayoutList();
    if(list.length>0){
      let filter=list.filter(x=>x.type==Payout.Bonus && x.scriptid==id)
      let qty=filter.map(x=>x.Amount).reduce((a,b)=>a+(b||0),0);
      return qty;
    }else{
      return 0;
    }
  }
}
