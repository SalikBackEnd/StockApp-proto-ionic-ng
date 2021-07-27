import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PnlPageRoutingModule } from './pnl-routing.module';

import { PnlPage } from './pnl.page';
import { ScriptcomboboxComponent } from 'src/app/components/scriptcombobox/scriptcombobox.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PnlPageRoutingModule
  ],
  declarations: [PnlPage,ScriptcomboboxComponent]
})
export class PnlPageModule {}
