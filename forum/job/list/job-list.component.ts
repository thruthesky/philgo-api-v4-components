import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { PhilGoApiService } from '../../../../philgo-api/philgo-api.service';

@Component({
    selector: 'app-job-list-component',
    templateUrl: 'job-list.component.html',
    styleUrls: ['../../../scss/index.scss', './job-list.component.scss']
})

export class ForumJobListComponent implements OnInit, AfterViewInit {

    @Input() category;
    constructor(
        public philgo: PhilGoApiService
    ) { }
    ngOnInit() { }
    ngAfterViewInit() {
    }
    onClickPost() {

    }
}
