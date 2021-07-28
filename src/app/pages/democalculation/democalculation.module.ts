import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DemocalculationPageRoutingModule } from './democalculation-routing.module';

import { DemocalculationPage } from './democalculation.page';
import { ScriptcomboboxComponent } from 'src/app/components/scriptcombobox/scriptcombobox.component';
import { CalculationComponent } from 'src/app/components/calculation/calculation.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DemocalculationPageRoutingModule
  ],
  declarations: [DemocalculationPage,ScriptcomboboxComponent,CalculationComponent]
})
export class DemocalculationPageModule {}
