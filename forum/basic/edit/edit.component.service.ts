import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EditComponent } from './edit.component';
@Injectable()
export class EditService {
  constructor(
    public modalController: ModalController
  ) { }
  async present(data): Promise<{ data?: any, role: 'success' | 'close' }> {
    const modal = await this.modalController.create({
      component: EditComponent,
      componentProps: {
        controller: this.modalController,
        data: data
      }
    });
    await modal.present();
    return await <any>modal.onDidDismiss();
  }
}
