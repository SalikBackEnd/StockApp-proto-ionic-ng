import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BuyPageRoutingModule } from './buy-routing.module';

import { BuyPage } from './buy.page';
import { CalculationComponent } from 'src/app/components/calculation/calculation.component';

import { ScriptselectComponent } from 'src/app/components/scriptselect/scriptselect.component';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BuyPageRoutingModule
  ],
  declarations: [BuyPage,CalculationComponent,ScriptselectComponent]
})
export class BuyPageModule {}
