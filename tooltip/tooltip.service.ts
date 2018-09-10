import { Injectable } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { TooltipComponent } from './tooltip.component';
import { TooltipProps } from './tooltip.interface';

@Injectable()
export class TooltipService {

  constructor(
    public popoverController: PopoverController
  ) { }

  async present(event: any, props: TooltipProps) {
    const popover = await this.popoverController.create({
      component: TooltipComponent,
      componentProps: {
        controller: this.popoverController,
        props: props
      },
      event: event,
      translucent: true
    });
    return await popover.present();
  }
}

