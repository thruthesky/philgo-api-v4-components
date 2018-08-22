import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { MyRoomsComponent } from './chat-my-room.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [
    MyRoomsComponent
  ],
  exports: [
    MyRoomsComponent
  ]
})
export class MyRoomsComponentModule {}
