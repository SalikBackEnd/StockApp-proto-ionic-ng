import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScriptsPageRoutingModule } from './scripts-routing.module';

import { ScriptsPage } from './scripts.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScriptsPageRoutingModule
  ],
  declarations: [ScriptsPage]
})
export class ScriptsPageModule {}
