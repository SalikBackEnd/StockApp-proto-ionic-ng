import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DemoplPageRoutingModule } from './demopl-routing.module';

import { DemoplPage } from './demopl.page';
import { ScriptcomboboxComponent } from 'src/app/components/scriptcombobox/scriptcombobox.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DemoplPageRoutingModule
  ],
  declarations: [DemoplPage,ScriptcomboboxComponent]
})
export class DemoplPageModule {}
