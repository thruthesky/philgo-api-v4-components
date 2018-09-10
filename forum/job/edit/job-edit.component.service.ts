import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { JobEditComponent } from './job-edit.component';
@Injectable()
export class JobEditService {
  constructor(
    public modalController: ModalController
  ) { }
  async present(data): Promise<{ data?: any, role: 'success' | 'delete' | 'close' }> {
    const modal = await this.modalController.create({
      component: JobEditComponent,
      componentProps: {
        controller: this.modalController,
        data: data
      }
    });
    await modal.present();
    return await <any>modal.onDidDismiss();
  }
}
