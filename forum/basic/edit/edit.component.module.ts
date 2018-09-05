import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditComponent } from './edit.component';
import { EditService } from './edit.component.service';
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
  declarations: [EditComponent],
  entryComponents: [EditComponent],
  exports: [EditComponent],
  providers: [EditService]
})
export class EditComponentModule { }
