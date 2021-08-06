import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DataTypes, HelperService, Tables, TransactionType } from './helper.service';

@Injectable({
  providedIn: 'root'
})
export class LocalService {


  data: any = [];
  public buyList: any = [];
  public sellList: any = [];
  public scriptlist: any = [];
  
  public objfavscripts:any={
    id:"",name:"",fav:false
  };
  
  public isdarkmode:boolean=false;
  public isTaxInclude:boolean=false;

  constructor(public http: HttpClient) { 
    this.GetScriptsList();
    this.isDarkMode();
    this.isIncludeTax()
  }

  
  GetScripts(): Observable<object> {
    return this.http.get('assets/data/scripts.json');
  }
  GetLastId(key) {
    let List = this.GetData(key);
    if (List != undefined) {
      let id = List.reverse();
      if (id[0].id == "") {
        return 0;
      }
      return parseInt(id[0].id);
    } else {
      return 0;
    }
  }
  GetData(key) {
    let data=localStorage.getItem(key);
    let arr:any=[];
    if(data !=null){
       arr.push(JSON.parse(data));
       
       return arr[0];
    }else{
      return undefined;
    }
    //Return Json object if return string is null then function return undefined
  }
  SetData(key, value) {
    let val = JSON.stringify(value);
    localStorage.setItem(key, val);
  }
  numberOnlyValidation(event: any) {
    const pattern = /[0-9.,]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }
  countTotalShares() {
    let buycount = 0;
    let sellcount = 0;
    

      this.buyList = this.BuyList();
      this.sellList = this.SellList();
      let A = [];
      if (this.buyList.length>0) {
      
        buycount = this.buyList.map(e=>e.quantity).reduce((a, b) => a + (b || 0), 0);
        
        console.log( "BuyList length: "+this.buyList.length+" Buy Count:"+buycount);
      }
      if (this.sellList.length>0) {
       
        sellcount=this.sellList.map(e=>e.quantity).reduce((a, b) => a + (b || 0), 0);
      }
      console.log("Total Shares: " + (buycount - sellcount))
      return (buycount - sellcount);

  }
  
  totalAmount() {
    let buyamount = 0;
    let sellamount = 0;
    
    this.buyList = this.BuyList();
    this.sellList = this.SellList();
    
    if (this.buyList.length>0) {
      let priceobj = this.buyList.map(a => a.price).reduce((a, b) => a + (b||0), 0);
      let quantityobj = this.buyList.map(a => a.quantity).reduce((a, b) => a + (b||0), 0);
      
        buyamount = (priceobj) * (quantityobj);
    }
    if (this.sellList.length>0) {
      let priceobj = this.sellList.map(a => a.price).reduce((a, b) => a + (b||0), 0);
      let quantityobj = this.sellList.map(a => a.quantity).reduce((a, b) => a + (b||0), 0);
      
        sellamount = (priceobj) * (quantityobj);
    }
    
    return (buyamount - sellamount);
  }
  GenerateId(key) {
    return this.GetLastId(key) + 1;
  }
  onIncludeTaxCheck(tax, toast) {
    if (tax) {
      toast.show("Tax and Comission will apply on this transaction.");
    } else {
      toast.show("No Tax and Comission will be applied on this transaction.");
    }
  }
  GetScriptsList() {
    
    this.GetScripts().subscribe(res => {
      this.scriptlist = res;
    }, err => {
      console.log(err)
    });
  
  }
  BuyList(){
    let list:any=[];
    list=this.GetData(Tables.Transaction);
    if(list != undefined && Array.isArray(list)){
      return list.filter(e=>(e.id!=""||e.id!=0)&&(e.statusid==TransactionType.Buy));
    }
    else
    return [];
  }
  scriptsBuyList(scriptid){
    let list:any=[];
    list=this.GetData(Tables.Transaction);
    if(list != undefined ){
    let filtered= list.filter(e=>(e.id!=""||e.id!=0)&&(e.statusid==TransactionType.Buy)&&e.scriptid==scriptid);
    if(filtered.length>0){
      return filtered;
    }else{
      return [];
    }
    }
    else
    return [];
  }
  SellList(){
    let list:any;
    list=this.GetData(Tables.Transaction);
    if(list != undefined)
    return list.filter(e=>(e.id!=""||e.id!=0)&&(e.statusid==TransactionType.Sell));
    else
    return [];
  }
  scriptsSellList(scriptid) {
    let list: any;
    list = this.SellList();
    if (list != undefined) {
      let filtered:any =[];
      //if scriptid is given then fiiter else return whole list.
      if(scriptid != null && scriptid != "" && scriptid != undefined){
        filtered = list.filter(e => e.scriptid == scriptid);
        if (filtered.length > 0) {
          return filtered;
        } else {
          return [];
        }
      }else{
        return list;
      }
      
     
    }
    else
      return [];
  }
  PopulateFavScript(){
    let favScripts:any=[];
    favScripts= this.GetData(Tables.FavScripts);
    if(favScripts!=undefined && favScripts.length>0){
     
    }else{
      let favarr:any=[];
      this.scriptlist.forEach(element => {
        this.objfavscripts={
          id:element.id,
          name:element.name,
          fav:false
        }
        favarr.push(this.objfavscripts);
       });
       this.SetData(Tables.FavScripts,favarr);
    }
  }
  isDarkMode(){
    let darkmode=this.GetData(Tables.Darkmode);
    if(darkmode !=undefined){
      this.isdarkmode=darkmode;
      if(darkmode){
        document.body.setAttribute('data-theme', 'dark');
      }
    }
  }
  isIncludeTax(){
    let taxnc=this.GetData(Tables.TaxnComission);
    if(taxnc != undefined || taxnc != null){
      this.isTaxInclude=taxnc;
    }
  }
  
}
