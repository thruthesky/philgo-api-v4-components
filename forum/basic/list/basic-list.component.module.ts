import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { EditComponentModule } from '../edit/edit.component.module';
import { MenuPopoverComponent } from './menu-popover/menu-popover.component';
import { ForumBasicListComponent } from './basic-list.component';



@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        EditComponentModule
    ],
    exports: [ForumBasicListComponent],
    declarations: [ForumBasicListComponent, MenuPopoverComponent],
    entryComponents: [MenuPopoverComponent],
    providers: [],
})
export class ForumBasicListComponentModule { }
