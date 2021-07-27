import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LogsPageRoutingModule } from './logs-routing.module';

import { LogsPage } from './logs.page';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ScriptcomboboxComponent } from 'src/app/components/scriptcombobox/scriptcombobox.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LogsPageRoutingModule,
    Ng2SearchPipeModule
  ],
  declarations: [LogsPage,ScriptcomboboxComponent]
})
export class LogsPageModule {}
