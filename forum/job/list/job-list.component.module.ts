import { NgModule } from '@angular/core';
import { ForumJobListComponent } from './job-list.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
    imports: [
        IonicModule
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
