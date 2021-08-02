import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PayoutPageRoutingModule } from './payout-routing.module';

import { PayoutPage } from './payout.page';
import { ScriptcomboboxComponent } from 'src/app/components/scriptcombobox/scriptcombobox.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PayoutPageRoutingModule
  ],
  declarations: [PayoutPage,ScriptcomboboxComponent]
})
export class PayoutPageModule {}
