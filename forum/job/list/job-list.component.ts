import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { PhilGoApiService, ApiForum, ApiPost } from '../../../../philgo-api/philgo-api.service';
import { JobEditService } from '../edit/job-edit.component.service';
import { InfiniteScroll, ModalController } from '@ionic/angular';

import * as N from '../job.defines';
import { JobViewComponent } from '../view/job.view.component';

@Component({
    selector: 'app-job-list-component',
    templateUrl: 'job-list.component.html',
    styleUrls: ['../../../scss/index.scss', './job-list.component.scss']
})

export class JobListComponent implements OnInit, AfterViewInit {

    forum: ApiForum = null;
    posts: Array<ApiPost> = [];
    @Input() category;


    /**
     * Page nav
     */
    post_id = 'wanted';
    page_no = 1;
    limit = 12;
    noMorePosts = false;


    N = N;


    //
    constructor(
        private modalController: ModalController,
        public philgo: PhilGoApiService,
        public edit: JobEditService
    ) { }
    ngOnInit() { }
    ngAfterViewInit() {
        setTimeout(() => this.onClickPost(), 200);

        this.loadPage();
    }

    async onClickPost() {


        const re = await this.edit.present({
            post_id: 'wanted',
            category: this.category
        });

        if (re.role === 'success') {
            this.posts.unshift(re.data);
        }

    }

    loadPage(event?: Event) {
        let infiniteScroll: InfiniteScroll;
        if (event) {
            infiniteScroll = <any>event.target;
        }
        this.philgo.postSearch({ post_id: this.post_id, page_no: this.page_no, limit: this.limit }).subscribe(search => {
            console.log('search: ', search);
            this.page_no++;
            this.forum = search;

            if (!search.posts || !search.posts.length) {
                infiniteScroll.disabled = true;
                this.noMorePosts = true;
                return;
            }
            this.posts = this.posts.concat(search.posts);
            if (event) {
                infiniteScroll.complete();
            }
        });
    }

    async onView(post: ApiPost) {
        const modal = await this.modalController.create({
            component: JobViewComponent,
            componentProps: {
                controller: this.modalController,
                post: post
            }
        });
        await modal.present();
        const re = await modal.onDidDismiss();
    }
}
