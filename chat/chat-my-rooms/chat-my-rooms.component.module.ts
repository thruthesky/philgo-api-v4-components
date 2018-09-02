import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ChatMyRoomsComponent } from './chat-my-rooms.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule
  ],
  declarations: [
    ChatMyRoomsComponent
  ],
  exports: [
    ChatMyRoomsComponent
  ]
})
export class ChatMyRoomsComponentModule {}

