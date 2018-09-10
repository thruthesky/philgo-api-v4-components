import { NgModule } from '@angular/core';
import { JobListComponent } from './job-list.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { JobEditComponentModule } from '../edit/job-edit.component.module';
import { JobViewComponent } from '../view/job.view.component';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        JobEditComponentModule
    ],
    declarations: [
        JobListComponent,
        JobViewComponent
    ],
    entryComponents: [
        JobViewComponent
    ],
    exports: [
        JobListComponent
    ],
    providers: [],
})
export class JobListComponentModule { }
