import { NgModule } from '@angular/core';
import { PostListComponent } from './post-list.component';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { EditComponentModule } from '../edit/edit.component.module';



@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        EditComponentModule
    ],
    exports: [PostListComponent],
    declarations: [PostListComponent],
    providers: [],
})
export class PostListModule { }
