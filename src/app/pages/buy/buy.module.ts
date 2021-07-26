import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BuyPageRoutingModule } from './buy-routing.module';

import { BuyPage } from './buy.page';
import { CalculationComponent } from 'src/app/components/calculation/calculation.component';
import { ScriptcomboboxComponent } from 'src/app/components/scriptcombobox/scriptcombobox.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BuyPageRoutingModule
    
  ],
  declarations: [BuyPage,CalculationComponent,ScriptcomboboxComponent]
})
export class BuyPageModule {}
