import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LogsPageRoutingModule } from './logs-routing.module';

import { LogsPage } from './logs.page';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ScriptselectComponent } from 'src/app/components/scriptselect/scriptselect.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LogsPageRoutingModule,
    Ng2SearchPipeModule
  ],
  declarations: [LogsPage,ScriptselectComponent]
})
export class LogsPageModule {}
