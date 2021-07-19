import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SellPage } from './sell.page';

const routes: Routes = [
  {
    path: '',
    component: SellPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SellPageRoutingModule {}
