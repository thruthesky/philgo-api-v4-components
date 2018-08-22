import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ChatRoomInputComponent } from './chat-room-input.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule
    ],
    declarations: [
        ChatRoomInputComponent,
    ],
    exports: [
        ChatRoomInputComponent
    ]
})
export class ChatRoomInputComponentModule { }

