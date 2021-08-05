import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InventoryPageRoutingModule } from './inventory-routing.module';

import { InventoryPage } from './inventory.page';
import { ScriptselectComponent } from 'src/app/components/scriptselect/scriptselect.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InventoryPageRoutingModule
  ],
  declarations: [InventoryPage,ScriptselectComponent]
})
export class InventoryPageModule {}
