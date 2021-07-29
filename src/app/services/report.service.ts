import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file/ngx';


@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private File:File) { }
}
