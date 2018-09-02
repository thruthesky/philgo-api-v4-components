import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ChatRoomMessagesComponent } from './chat-room-messages.component';
import { ChatRoomSendFileComponent } from './send-file/send-file.component';
import { ChatRoomShowFileComponent } from './show-file/show-file.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule
    ],
    declarations: [
        ChatRoomMessagesComponent,
        ChatRoomSendFileComponent,
        ChatRoomShowFileComponent
    ],
    exports: [
        ChatRoomMessagesComponent
    ]
})
export class ChatRoomMessagesComponentModule { }

