import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScriptlistPage } from './scriptlist.page';

const routes: Routes = [
  {
    path: '',
    component: ScriptlistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScriptlistPageRoutingModule {}
