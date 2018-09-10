import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TooltipComponent } from './tooltip.component';
import { TooltipService } from './tooltip.service';
export { TooltipService };

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [TooltipComponent],
  entryComponents: [TooltipComponent],
  providers: [
    TooltipService
  ]
})
export class TooltipModule { }
