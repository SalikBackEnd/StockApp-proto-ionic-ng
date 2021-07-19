import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { ViewscriptPageModule } from './modal/viewscript/viewscript.module';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { LocalService } from './services/local.service';
import { PnlPageModule } from './pages/pnl/pnl.module';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [HttpClientModule,BrowserModule, IonicModule.forRoot(), AppRoutingModule,ViewscriptPageModule,PnlPageModule],
  providers: [HttpClientModule,LocalService,{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
