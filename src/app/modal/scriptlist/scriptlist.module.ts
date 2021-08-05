import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScriptlistPageRoutingModule } from './scriptlist-routing.module';

import { ScriptlistPage } from './scriptlist.page';
import { ScriptselectComponent } from 'src/app/components/scriptselect/scriptselect.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScriptlistPageRoutingModule
  ],
  declarations: [ScriptlistPage,ScriptselectComponent]
})
export class ScriptlistPageModule {}
