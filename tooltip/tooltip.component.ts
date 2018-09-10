import { Component, OnInit } from '@angular/core';
import { TooltipProps } from './tooltip.interface';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
})
export class TooltipComponent implements OnInit {

  controller: PopoverController;
  props: TooltipProps;
  constructor() { }

  ngOnInit() {
    console.log('props: ', this.props);
  }

}

