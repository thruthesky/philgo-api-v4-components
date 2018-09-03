import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-job-list-component',
    templateUrl: 'job-list.component.html',
    styleUrls: ['job-list.component.scss']
})

export class JobListComponent implements OnInit {

    @Input() title;
    @Input() category;
    constructor() { }

    ngOnInit() { }
}