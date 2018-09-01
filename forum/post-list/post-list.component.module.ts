import { NgModule } from '@angular/core';
import { PostListComponent } from './post-list.component';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { EditComponentModule } from '../edit/edit.component.module';
import { MenuPopoverComponent } from './menu-popover/menu-popover.component';



@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        EditComponentModule
    ],
    exports: [PostListComponent],
    declarations: [PostListComponent, MenuPopoverComponent],
    entryComponents: [MenuPopoverComponent],
    providers: [],
})
export class PostListModule { }
