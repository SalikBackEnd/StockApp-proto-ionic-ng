import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DemoplPage } from './demopl.page';

const routes: Routes = [
  {
    path: '',
    component: DemoplPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DemoplPageRoutingModule {}
