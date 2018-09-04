import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-menu-popover',
  templateUrl: './menu-popover.component.html',
  styleUrls: ['../../../../scss/index.scss']
})
export class MenuPopoverComponent implements OnInit {

  controller: PopoverController;
  constructor() { }

  ngOnInit() {
  }

}
