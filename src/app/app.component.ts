import { Component } from '@angular/core';
import { LocalService } from './services/local.service';
import { StartupService } from './services/startup.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public Scripts=[];
  public scriptsList=[];
  
  data:any;
  constructor(public startup:StartupService,public local:LocalService) {
    
   }
  
}
