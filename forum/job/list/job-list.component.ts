import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { PhilGoApiService, ApiForum, ApiPost, ApiPostSearch } from '../../../../philgo-api/philgo-api.service';
import { JobEditService } from '../edit/job-edit.component.service';
import { InfiniteScroll } from '@ionic/angular';

import * as N from '../job.defines';
import { ComponentService } from '../../../service/component.service';
import { TooltipService } from '../../../tooltip/tooltip.module';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-job-list-component',
    templateUrl: 'job-list.component.html',
    styleUrls: ['../../../scss/index.scss', './job-list.component.scss']
})

export class JobListComponent implements OnInit, AfterViewInit {

    showSearch = false;
    forum: ApiForum = null;
    posts: Array<ApiPost> = [];
    postView: ApiPost = null;
    @Input() category;


    form: ApiPost = <ApiPost>{};
    provinces: Array<string> = [];
    cities: Array<string> = [];
    showCities = false;
    province = '';
    city = '';


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
        private readonly activatedRoute: ActivatedRoute,
        private readonly componentService: ComponentService,
        public philgo: PhilGoApiService,
        public edit: JobEditService,
        public tooltip: TooltipService
    ) {

    }
    ngOnInit() { }
    ngAfterViewInit() {
        // setTimeout(() => this.onClickPost(), 200);

        this.activatedRoute.paramMap.subscribe(params => {
            const idx = params.get('idx');
            this.loadPage(null, { view: idx });
        });

        this.philgo.provinces().subscribe( provinces => {
            // console.log('provinces:: ', provinces);
            this.provinces = provinces;
        }, e => {
            this.componentService.alert(e);
        });
    }


    loadPage(event?: Event,  options: { view: string } = <any>{}) {
        let infiniteScroll: InfiniteScroll;
        if (event) {
            infiniteScroll = <any>event.target;
        }

        const req: ApiPostSearch = { post_id: this.post_id, category: this.category, page_no: this.page_no, limit: this.limit, deleted: 0 };
        if (options.view) {
            req.view = options.view;
        }
        this.philgo.postSearch(req).subscribe(search => {
            console.log('search: ', search);
            this.page_no++;
            this.forum = search;
            if ( search && search.view && search.view.idx ) {
                this.postView = search.view;
            }

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

        if (this.philgo.isLoggedOut()) {
            return this.componentService.alert({ message: this.philgo.t({ ko: '먼저 로그인하십시오.', en: 'Please sign-in first.' }) });
        }


        const re = await this.edit.present({
            post_id: 'wanted',
            category: this.category
        });

        if (re.role === 'success') {
            this.posts.unshift(re.data);
        }

    }

    async onView(post: ApiPost, autoViewContent) {
        if ( !autoViewContent ) {
            post['showMore'] = !post['showMore'];
        }
        history.pushState({}, post.subject, `/job/${post.category}/${post.idx}`);

        // const modal = await this.modalController.create({
        //     component: JobViewComponent,
        //     componentProps: {
        //         controller: this.modalController,
        //         post: post
        //     }
        // });
        // await modal.present();
        // const re = await modal.onDidDismiss();
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
        });
    }

    onClickProvince() {
        console.log('onClickProvince:: ', this.province);
        if ( this.province ) {
            this.city = this.province;
            this.getCities();
        }
    }

    getCities() {
        this.showCities = false;
        this.philgo.cities(this.province).subscribe( cities => {
            console.log('getCities:: ', this.city);
            this.cities = cities;
            this.showCities = true;
        }, e => {
            this.componentService.alert(e);
            this.showCities = false;
        });
    }

    get cityKeys() {
        return Object.keys(this.cities);
    }
}
