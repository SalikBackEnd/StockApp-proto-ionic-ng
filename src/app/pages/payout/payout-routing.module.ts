import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PayoutPage } from './payout.page';

const routes: Routes = [
  {
    path: '',
    component: PayoutPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PayoutPageRoutingModule {}
