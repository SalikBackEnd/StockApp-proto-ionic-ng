import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PayoutPageRoutingModule } from './payout-routing.module';

import { PayoutPage } from './payout.page';

import { ScriptselectComponent } from 'src/app/components/scriptselect/scriptselect.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PayoutPageRoutingModule
  ],
  declarations: [PayoutPage,ScriptselectComponent]
})
export class PayoutPageModule {}
