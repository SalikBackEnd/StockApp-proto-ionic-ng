import { Component } from '@angular/core';
import { LocalService } from './services/local.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public Scripts=[];
  public scriptsList=[];
  
  data:any;
  constructor(public local:LocalService) {
    
   }
  
}
