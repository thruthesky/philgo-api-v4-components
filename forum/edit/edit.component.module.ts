import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditComponent } from './edit.component';
import { EditService } from './edit.component.service';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],
  declarations: [EditComponent],
  entryComponents: [EditComponent],
  exports: [EditComponent],
  providers: [EditService]
})
export class EditComponentModule { }
