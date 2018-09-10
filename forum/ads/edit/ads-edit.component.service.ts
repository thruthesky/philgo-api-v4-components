import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AdsEditComponent } from './ads-edit.component';
@Injectable()
export class AdsEditService {
  constructor(
    public modalController: ModalController
  ) { }
  async present(data): Promise<{ data?: any, role: 'success' | 'delete' | 'close' }> {
    const modal = await this.modalController.create({
      component: AdsEditComponent,
      componentProps: {
        controller: this.modalController,
        data: data
      }
    });
    await modal.present();
    return await <any>modal.onDidDismiss();
  }
}
