import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { PhilGoApiService, ApiForum, ApiPost } from '../../../../philgo-api/philgo-api.service';
import { JobEditService } from '../edit/job-edit.component.service';
import { InfiniteScroll, ModalController, PopoverController } from '@ionic/angular';

import * as N from '../job.defines';
import { JobViewComponent } from '../view/job.view.component';
import { MenuPopoverComponent } from '../../basic/list/menu-popover/menu-popover.component';
import { ComponentService } from '../../../service/component.service';
import { TooltipService } from '../../../tooltip/tooltip.module';

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
        private readonly popoverController: PopoverController,
        private readonly componentService: ComponentService,
        public philgo: PhilGoApiService,
        public edit: JobEditService,
        public tooltip: TooltipService
    ) {

    }
    ngOnInit() { }
    ngAfterViewInit() {
        setTimeout(() => this.onClickPost(), 200);

        this.loadPage();
    }


    async onClickMenu(event: any, post: ApiPost) {
        // event.stopPropagation();
        // const popover = await this.popoverController.create({
        //     component: MenuPopoverComponent,
        //     componentProps: {
        //         controller: this.popoverController
        //     },
        //     event: event,
        //     translucent: true
        // });
        // await popover.present();
        // const re = await popover.onDidDismiss();
        // const action = re.role;

        // console.log('action: ', action);
        // if (action === 'view') {
        //     this.onView(post);
        // } else if (action === 'edit') {
        //     this.onEdit(post);
        // } else if (action === 'delete') {
        //     this.onDelete(post);
        // }
    }



    loadPage(event?: Event) {
        let infiniteScroll: InfiniteScroll;
        if (event) {
            infiniteScroll = <any>event.target;
        }
        this.philgo.postSearch({ post_id: this.post_id, category: this.category, page_no: this.page_no, limit: this.limit, deleted: 0 }).subscribe(search => {
            console.log('search: ', search);
            this.page_no++;
            this.forum = search;

            if (!search.posts || !search.posts.length) {
                if (event) {
                    infiniteScroll.disabled = true;
                }
                this.noMorePosts = true;
                return;
            }
            this.posts = this.posts.concat(search.posts);
            if (event) {
                infiniteScroll.complete();
            }
        });
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

    async onView(post: ApiPost) {
        history.pushState({}, post.subject, `/job/${post.category}/${post.idx}`);
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

    /**
     * Opens Job edit box.
     * @param post  job post
     */
    async onEdit(post: ApiPost) {

        /**
         * Make a copy from job post. So, it will not be referenced.
         */
        const data = Object.assign({}, post);
        const res = await this.edit.present(data);
        if (res.role === 'success') {
            Object.assign(post, res.data);
        }
    }

    async onDelete(post: ApiPost) {
        console.log(post);
        const re = await this.componentService.deletePostWithMemberLogin(post);
        if (re === 'success') {
            const pos = this.posts.findIndex(p => p.idx === post.idx);
            console.log('pos: ', pos);
            if (pos !== -1) {
                this.posts.splice(pos, 1);
            }
        }
    }

    onClickNotVerified( event: Event ) {
        this.tooltip.present( event, {
            title: this.philgo.t({en: 'Not Verfieid', ko: '확인 안됨'}),
            subTitle: this.philgo.t({en: 'Profile is not verfied, yet.', ko: '프로필이 확인되지 않았습니다.'}),
            content: this.philgo.t({en: 'The profile of this person is not yet verified.', ko: '이 구직자의 프로필이 아직 검증되지 않았습니다.'})
        })
    }
}
