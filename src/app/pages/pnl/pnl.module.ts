import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PnlPageRoutingModule } from './pnl-routing.module';

import { PnlPage } from './pnl.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PnlPageRoutingModule
  ],
  declarations: [PnlPage]
})
export class PnlPageModule {}
