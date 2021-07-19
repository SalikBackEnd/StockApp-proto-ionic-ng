import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewscriptPageRoutingModule } from './viewscript-routing.module';

import { ViewscriptPage } from './viewscript.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewscriptPageRoutingModule
  ],
  declarations: [ViewscriptPage]
})
export class ViewscriptPageModule {}
