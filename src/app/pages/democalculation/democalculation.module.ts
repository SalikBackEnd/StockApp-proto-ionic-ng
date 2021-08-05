import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DemocalculationPageRoutingModule } from './democalculation-routing.module';

import { DemocalculationPage } from './democalculation.page';

import { CalculationComponent } from 'src/app/components/calculation/calculation.component';
import { ScriptselectComponent } from 'src/app/components/scriptselect/scriptselect.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DemocalculationPageRoutingModule
  ],
  declarations: [DemocalculationPage,ScriptselectComponent,CalculationComponent]
})
export class DemocalculationPageModule {}
