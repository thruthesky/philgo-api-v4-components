import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EditComponent } from './edit.component';
import { ApiForum } from '../../../philgo-api/philgo-api.service';
@Injectable()
export class EditService {
  constructor(
    public modalController: ModalController
  ) { }
  async present(forum: ApiForum): Promise<{ data?: any, role: 'success' | 'close' }> {
    const modal = await this.modalController.create({
      component: EditComponent,
      componentProps: {
        controller: this.modalController,
        forum: forum
      }
    });
    await modal.present();
    return await <any>modal.onDidDismiss();
  }
}
