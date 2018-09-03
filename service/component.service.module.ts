import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentService } from './component.service';
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [
    CommonModule,
    IonicModule
  ],
  declarations: [],
  providers: [
    ComponentService
  ]
})
export class ComponentServiceModule { }
