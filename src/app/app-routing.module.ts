import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  // {
  //   path: '',
  //   redirectTo: 'buy',
  //   pathMatch: 'full'
  // },
  // {
  //   path: 'buy',
  //   loadChildren: () => import('./pages/buy/buy.module').then( m => m.BuyPageModule)
  // },
  // {
  //   path: 'Buy',
  //   loadChildren: () => import('./pages/buy/buy.module').then( m => m.BuyPageModule)
  // },
  // {
  //   path: 'sell',
  //   loadChildren: () => import('./pages/sell/sell.module').then( m => m.SellPageModule)
  // },
  // {
  //   path: 'Sell',
  //   loadChildren: () => import('./pages/sell/sell.module').then( m => m.SellPageModule)
  // },
  // {
  //   path: 'inventory',
  //   loadChildren: () => import('./pages/inventory/inventory.module').then( m => m.InventoryPageModule)
  // },
  {
    path: '',
    loadChildren: () => import('./pages/tab-bar/tab-bar.module').then( m => m.TabBarPageModule)
  },
  {
    path: 'viewscript',
    loadChildren: () => import('./modal/viewscript/viewscript.module').then( m => m.ViewscriptPageModule)
  },
  {
    path: 'pnl',
    loadChildren: () => import('./pages/pnl/pnl.module').then( m => m.PnlPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
