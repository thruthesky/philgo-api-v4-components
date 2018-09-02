import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ChatUpdateComponent } from './chat-update.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule
    ],
    declarations: [
        ChatUpdateComponent
    ],
    exports: [
        ChatUpdateComponent
    ]
})
export class ChatUpdateComponentModule { }

