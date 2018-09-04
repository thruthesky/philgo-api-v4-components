import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AlertOptions } from '@ionic/core';
import { PhilGoApiService } from '../../philgo-api/philgo-api.service';

@Injectable()
export class ComponentService {

  constructor(
    private readonly alertController: AlertController,
    private readonly philgo: PhilGoApiService
  ) { }

  async alert(options: AlertOptions) {
    if (!options) {
      return;
    }

    if ( ! options.buttons ) {
      options.buttons = [this.philgo.t({ en: 'OK', ko: '확인' })];
    }

    const fail = await this.alertController.create(options);
    await fail.present();
  }
}
