import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';


import { TabBarPage } from './tab-bar.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabBarPage,
    children:[
      {
        path:'buy',
        children:[
        {  
          path:'',
          loadChildren: () =>
           import('../buy/buy.module').then( m => m.BuyPageModule)
        }
        ]
      },
      {
        path:'sell',
        children:[
          {
            path:'',
            loadChildren: () =>
             import('../sell/sell.module').then(m=>m.SellPageModule)
          }
        ]
      },
      {
        path:'inventory',
        children:[
          {
            path:'',
            loadChildren: () =>
             import('../inventory/inventory.module').then(m=>m.InventoryPageModule)
          }
        ]
      },
      {
        path:'',
        redirectTo:'/tabs/buy',
        pathMatch:'full'
      }
    ]
  },{
    path:'',
    redirectTo:'/tabs/buy',
    pathMatch:'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabBarPageRoutingModule {}
