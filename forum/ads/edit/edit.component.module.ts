import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdsEditComponent } from './edit.component';
import { AdsEditService } from './edit.component.service';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { FilesComponentModule } from '../../files/files.module';
import { ComponentServiceModule } from '../../../service/component.service.module';
@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    FilesComponentModule,
    ComponentServiceModule
  ],
  declarations: [AdsEditComponent],
  entryComponents: [AdsEditComponent],
  exports: [AdsEditComponent],
  providers: [AdsEditService]
})
export class AdsEditComponentModule { }
