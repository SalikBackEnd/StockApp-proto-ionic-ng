import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PnlPageRoutingModule } from './pnl-routing.module';

import { PnlPage } from './pnl.page';

import { ScriptselectComponent } from 'src/app/components/scriptselect/scriptselect.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PnlPageRoutingModule
  ],
  declarations: [PnlPage,ScriptselectComponent]
})
export class PnlPageModule {}
