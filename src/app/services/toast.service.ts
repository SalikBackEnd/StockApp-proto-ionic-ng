import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(public toast:ToastController) { }

  show(msg,duration=2000){
    let t=this.toast.create({
      message:msg,
      duration:duration
    }).then((toastData)=>{
      toastData.present();
    });
  }
}
