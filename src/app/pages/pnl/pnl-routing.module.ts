import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PnlPage } from './pnl.page';

const routes: Routes = [
  {
    path: '',
    component: PnlPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PnlPageRoutingModule {}
