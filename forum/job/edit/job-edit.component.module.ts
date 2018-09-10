import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobEditComponent } from './job-edit.component';
import { JobEditService } from './job-edit.component.service';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { FilesComponentModule } from '../../files/files.module';
import { ComponentServiceModule } from '../../../service/component.service.module';
import { TooltipModule } from '../../../tooltip/tooltip.module';
@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    FilesComponentModule,
    ComponentServiceModule,
    TooltipModule
  ],
  declarations: [JobEditComponent],
  entryComponents: [JobEditComponent],
  exports: [JobEditComponent],
  providers: [JobEditService]
})
export class JobEditComponentModule { }
