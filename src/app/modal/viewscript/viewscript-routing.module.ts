import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewscriptPage } from './viewscript.page';

const routes: Routes = [
  {
    path: '',
    component: ViewscriptPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewscriptPageRoutingModule {}
