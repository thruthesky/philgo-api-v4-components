import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ChatCreateRoomComponent } from './chat-create-room.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule
    ],
    declarations: [
        ChatCreateRoomComponent
    ],
    exports: [
        ChatCreateRoomComponent
    ]
})
export class ChatCreateRoomComponentModule { }

