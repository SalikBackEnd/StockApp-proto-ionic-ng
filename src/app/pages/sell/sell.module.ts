import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SellPageRoutingModule } from './sell-routing.module';

import { SellPage } from './sell.page';
import { CalculationComponent } from 'src/app/components/calculation/calculation.component';

import { ScriptselectComponent } from 'src/app/components/scriptselect/scriptselect.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SellPageRoutingModule
  ],
  declarations: [SellPage,CalculationComponent,ScriptselectComponent]
})
export class SellPageModule {}
