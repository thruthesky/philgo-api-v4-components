import { NgModule } from '@angular/core';
import { ForumJobListComponent } from './job-list.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        IonicModule,
        CommonModule
    ],
    declarations: [
        ForumJobListComponent
    ],
    exports: [
        ForumJobListComponent
    ],
    providers: [],
})
export class ForumJobListComponentModule { }
