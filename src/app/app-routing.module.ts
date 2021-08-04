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
  {
    path: 'logs',
    loadChildren: () => import('./pages/logs/logs.module').then( m => m.LogsPageModule)
  },
  {
    path: 'scripts',
    loadChildren: () => import('./pages/scripts/scripts.module').then( m => m.ScriptsPageModule)
  },
  {
    path: 'democalculation',
    loadChildren: () => import('./pages/democalculation/democalculation.module').then( m => m.DemocalculationPageModule)
  },
  {
    path: 'payout',
    loadChildren: () => import('./pages/payout/payout.module').then( m => m.PayoutPageModule)
  },
  {
    path: 'demopl',
    loadChildren: () => import('./modal/demopl/demopl.module').then( m => m.DemoplPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
