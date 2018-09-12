import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApiPost, PhilGoApiService } from '../../../../philgo-api/philgo-api.service';
import * as N from '../job.defines';

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

    constructor(public philgo: PhilGoApiService) {
    }

    ngOnInit() {
    }

    show(post) {
        return post['showMore'] || this.autoViewContent;
    }



}

