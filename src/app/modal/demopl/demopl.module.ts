import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DemoplPageRoutingModule } from './demopl-routing.module';

import { DemoplPage } from './demopl.page';

import { ScriptselectComponent } from 'src/app/components/scriptselect/scriptselect.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DemoplPageRoutingModule
  ],
  declarations: [DemoplPage,ScriptselectComponent]
})
export class DemoplPageModule {}
