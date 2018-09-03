import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ChatAllRoomsComponent } from './chat-all-rooms.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [
    ChatAllRoomsComponent
  ],
  exports: [
    ChatAllRoomsComponent
  ]
})
export class ChatAllRoomsComponentModule {}

