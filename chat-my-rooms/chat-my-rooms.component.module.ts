import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ChatMyRoomsComponent } from './chat-my-rooms.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [
    ChatMyRoomsComponent
  ],
  exports: [
    ChatMyRoomsComponent
  ]
})
export class ChatMyRoomsComponentModule {}

