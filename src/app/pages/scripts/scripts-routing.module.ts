import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScriptsPage } from './scripts.page';

const routes: Routes = [
  {
    path: '',
    component: ScriptsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScriptsPageRoutingModule {}
