import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BuyPageRoutingModule } from './buy-routing.module';

import { BuyPage } from './buy.page';
import { CalculationComponent } from 'src/app/components/calculation/calculation.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BuyPageRoutingModule
    
  ],
  declarations: [BuyPage,CalculationComponent]
})
export class BuyPageModule {}
