import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiPost, PhilGoApiService } from '../../../../philgo-api/philgo-api.service';
import * as N from '../job.defines';

@Component({
  selector: 'app-job-view',
  templateUrl: './job.view.component.html',
  styleUrls: ['../../../scss/index.scss', './job.view.component.scss']
})
export class JobViewComponent implements OnInit {

  controller: ModalController;
  post: ApiPost;

  N = N;
  constructor(
      public philgo: PhilGoApiService
  ) { }

  ngOnInit() {
  }

}

