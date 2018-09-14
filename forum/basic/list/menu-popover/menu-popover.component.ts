import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PhilGoApiService, ApiPost } from '../../../../../philgo-api/philgo-api.service';

@Component({
  selector: 'app-menu-popover',
  templateUrl: './menu-popover.component.html',
  styleUrls: ['../../../../scss/index.scss', './menu-popover.component.scss']
})
export class MenuPopoverComponent implements OnInit {

  controller: PopoverController;
  post: ApiPost;
  constructor(
    public philgo: PhilGoApiService
  ) { }

  ngOnInit() {
  }

}
