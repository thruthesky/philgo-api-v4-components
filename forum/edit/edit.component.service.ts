import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EditComponent } from './edit.component';
@Injectable()
export class EditService {
  constructor(
    public modalController: ModalController
  ) { }
  async present() {
    const modal = await this.modalController.create({
      component: EditComponent,
      componentProps: { controller: this.modalController }
    });
    return await modal.present();
  }
}
