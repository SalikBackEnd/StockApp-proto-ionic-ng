import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DemocalculationPageRoutingModule } from './democalculation-routing.module';

import { DemocalculationPage } from './democalculation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DemocalculationPageRoutingModule
  ],
  declarations: [DemocalculationPage]
})
export class DemocalculationPageModule {}
