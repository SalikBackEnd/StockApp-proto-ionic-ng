import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SellPageRoutingModule } from './sell-routing.module';

import { SellPage } from './sell.page';
import { CalculationComponent } from 'src/app/components/calculation/calculation.component';
import { ScriptcomboboxComponent } from 'src/app/components/scriptcombobox/scriptcombobox.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SellPageRoutingModule
  ],
  declarations: [SellPage,CalculationComponent,ScriptcomboboxComponent]
})
export class SellPageModule {}
