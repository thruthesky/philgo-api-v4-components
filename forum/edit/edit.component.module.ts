import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditComponent } from './edit.component';
import { EditService } from './edit.component.service';
import { IonicModule } from '@ionic/angular';
@NgModule({
  imports: [
    CommonModule,
    IonicModule
  ],
  declarations: [EditComponent],
  entryComponents: [EditComponent],
  exports: [EditComponent],
  providers: [EditService]
})
export class EditComponentModule { }
