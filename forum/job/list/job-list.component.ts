import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-job-list-component',
    templateUrl: 'job-list.component.html',
    styleUrls: ['../../../scss/index.scss']
})

export class ForumJobListComponent implements OnInit {

    @Input() title;
    @Input() category;
    constructor() { }

    ngOnInit() { }
}