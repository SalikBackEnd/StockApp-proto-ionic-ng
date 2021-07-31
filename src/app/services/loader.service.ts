import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor(private loading:LoadingController) {
    
   }
   async showAndDismiss(message:string,duration:number=400,cssClass:string='my-custom-class'){
    return new Promise<string>(async (resolve,rejected)=>{
      const loading=await this.loading.create({
        cssClass: cssClass,
        message: message,
        duration: duration
      });
      await loading.present();
      
      loading.onDidDismiss().then(()=>{
        resolve("Loader Dismissed!");
      });
    });
   }
  async show(message: string, duration: number = 1000, cssClass: string = 'my-custom-class') {
    const loading = await this.loading.create({
      cssClass: cssClass,
      message: message,
      duration: duration
    });
    await loading.present();
    
    return loading;
  }
  dismiss(loader) {
    return new Promise<string>((res,rej)=>{
      this.loading.dismiss();
      res("");
    });
    
  }
}
