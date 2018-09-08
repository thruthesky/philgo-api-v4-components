import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AdsEditComponentModule } from '../edit/edit.component.module';
import { AdsListComponent } from './ads-list.component';
import { ComponentServiceModule } from '../../../service/component.service.module';
import { FilesComponentModule } from '../../files/files.module';
// import { RouterModule } from '@angular/router';



@NgModule({
    imports: [
        CommonModule,
        // RouterModule,
        IonicModule,
        AdsEditComponentModule,
        ComponentServiceModule,
        FilesComponentModule
    ],
    exports: [AdsListComponent],
    declarations: [AdsListComponent],
    entryComponents: [],
    providers: [],
})
export class AdsListComponentModule { }
