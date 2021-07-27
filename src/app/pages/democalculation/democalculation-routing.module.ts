import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DemocalculationPage } from './democalculation.page';

const routes: Routes = [
  {
    path: '',
    component: DemocalculationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DemocalculationPageRoutingModule {}
