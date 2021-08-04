import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DemoplPageRoutingModule } from './demopl-routing.module';

import { DemoplPage } from './demopl.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DemoplPageRoutingModule
  ],
  declarations: [DemoplPage]
})
export class DemoplPageModule {}
