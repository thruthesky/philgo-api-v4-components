import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilesComponent } from './files.component';
import { IonicModule } from '@ionic/angular';
import { ComponentServiceModule } from '../../service/component.service.module';
@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ComponentServiceModule
  ],
  declarations: [FilesComponent],
  exports: [
    FilesComponent
  ]
})
export class FilesComponentModule { }
