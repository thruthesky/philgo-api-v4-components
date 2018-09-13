import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApiPost, PhilGoApiService } from '../../../../philgo-api/philgo-api.service';
import * as N from '../job.defines';
import { TooltipService } from '../../../tooltip/tooltip.module';
import { AngularLibrary } from '../../../../angular-library/angular-library';

@Component({
    selector: 'app-job-view',
    templateUrl: './job.view.component.html',
    styleUrls: ['../../../scss/index.scss', './job.view.component.scss']
})
export class JobViewComponent implements OnInit {

    @Input() post: ApiPost;
    @Input() autoViewContent = false;

    @Output() onView = new EventEmitter();
    @Output() onEdit = new EventEmitter();
    @Output() onDelete = new EventEmitter();



    N = N;
    _ = AngularLibrary;

    constructor(public philgo: PhilGoApiService,
        private tooltip: TooltipService
        ) {
    }

    ngOnInit() {
    }

    show(post) {
        return post['showMore'] || this.autoViewContent;
    }


    onClickNotVerified(event: Event) {
        this.tooltip.present(event, {
            title: this.philgo.t({ en: 'Not Verfieid', ko: '확인 안됨' }),
            subTitle: this.philgo.t({ en: 'Profile is not verfied, yet.', ko: '프로필이 확인되지 않았습니다.' }),
            content: this.philgo.t({ en: 'The profile of this person is not yet verified.', ko: '이 구직자의 프로필이 아직 검증되지 않았습니다.' })
        });
    }



}

