import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { EditComponentModule } from '../edit/edit.component.module';
import { MenuPopoverComponent } from './menu-popover/menu-popover.component';
import { ForumBasicListComponent } from './basic-list.component';
import { ComponentServiceModule } from '../../../service/component.service.module';
import { FilesComponentModule } from '../../files/files.module';
import { ViewComponent } from '../view/view.component';
// import { RouterModule } from '@angular/router';



@NgModule({
    imports: [
        CommonModule,
        // RouterModule,
        IonicModule,
        EditComponentModule,
        ComponentServiceModule,
        FilesComponentModule
    ],
    exports: [ForumBasicListComponent],
    declarations: [ForumBasicListComponent, MenuPopoverComponent, ViewComponent],
    entryComponents: [MenuPopoverComponent],
    providers: [],
})
export class ForumBasicListComponentModule { }
